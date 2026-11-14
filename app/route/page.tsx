import AddRouteModal from "@/components/add/add-route-modal"
import RoutesList from "@/components/routes-list"
import { ListFilterForm } from "@/components/list-filter-form"
import { ListPagination } from "@/components/list-pagination"
import { ListSortSelect } from "@/components/list-sort-select"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes, routeSortOptions } from "@/lib/constants"
import { createRoutesListFilterFields } from "@/lib/forms/list-filter-fields"
import {
  createListApiPath,
  createListPageHref,
  getListFilterValuesFromPageSearchParams,
  getListQueryFromPageSearchParams,
  hasActiveListFilters,
} from "@/lib/search-params"
import {
  fetchFromApi,
  getAuthTokenOrRedirect,
  getFirstApiFetchErrorMessage,
} from "@/lib/server/api"
import {
  Auto,
  Driver,
  ListPageState,
  Location,
  PageSearchParams,
  PagedList,
  Route,
  RouteSortField,
} from "@/lib/types"

const routesPageTitle = "Маршрути"
const routesPageDescription =
  "Перегляд доступних маршрутів із деталями відправлення, прибуття, автомобіля та водія."

interface RoutesPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function RoutesPage({ searchParams }: RoutesPageProps) {
  const authToken = await getAuthTokenOrRedirect()
  const pageSearchParams = await searchParams

  const [autosResult, driversResult, locationsResult] = await Promise.all([
    fetchFromApi<Auto[]>(apiEndpoints.allAutos, authToken),
    fetchFromApi<Driver[]>(apiEndpoints.allDrivers, authToken),
    fetchFromApi<Location[]>(apiEndpoints.allLocations, authToken),
  ])

  if (
    !autosResult.isSucceeded ||
    !driversResult.isSucceeded ||
    !locationsResult.isSucceeded
  ) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-8">
        <PageHeader
          title={routesPageTitle}
          description={routesPageDescription}
        />
        <LoadErrorMessage
          errorMessage={getFirstApiFetchErrorMessage([
            autosResult,
            driversResult,
            locationsResult,
          ])}
        />
      </div>
    )
  }

  const routesListFilterFields = createRoutesListFilterFields(
    autosResult.data,
    driversResult.data
  )
  const routesListPageState: ListPageState<RouteSortField> = {
    path: appRoutes.routes,
    listQuery: getListQueryFromPageSearchParams(
      pageSearchParams,
      RouteSortField
    ),
    filterValues: getListFilterValuesFromPageSearchParams(
      pageSearchParams,
      routesListFilterFields
    ),
  }
  const routesPageResult = await fetchFromApi<PagedList<Route>>(
    createListApiPath(
      apiEndpoints.routesPagedList,
      routesListPageState.listQuery,
      routesListPageState.filterValues
    ),
    authToken
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <PageHeader title={routesPageTitle} description={routesPageDescription}>
        <AddRouteModal
          autos={autosResult.data}
          drivers={driversResult.data}
          locations={locationsResult.data}
        />
      </PageHeader>

      <ListFilterForm
        key={createListPageHref(routesListPageState, {})}
        title="Розширений пошук маршрутів"
        listPageState={routesListPageState}
        listFilterFields={routesListFilterFields}
      />

      <div className="flex justify-end">
        <ListSortSelect
          listPageState={routesListPageState}
          sortOptions={routeSortOptions}
          sortFieldEnum={RouteSortField}
        />
      </div>

      {routesPageResult.isSucceeded ? (
        <>
          <RoutesList
            routes={routesPageResult.data.items}
            locations={locationsResult.data}
            autos={autosResult.data}
            drivers={driversResult.data}
            isRoutesListFiltered={hasActiveListFilters(routesListPageState)}
          />
          <ListPagination
            listPageState={routesListPageState}
            totalCount={routesPageResult.data.totalCount}
          />
        </>
      ) : (
        <LoadErrorMessage errorMessage={routesPageResult.errorMessage} />
      )}
    </div>
  )
}
