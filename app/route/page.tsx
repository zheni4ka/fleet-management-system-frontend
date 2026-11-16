import AddRouteModal from "@/components/add/add-route-modal"
import RoutesList from "@/components/routes-list"
import { ListFilterPanel } from "@/components/list-filter-panel"
import { ListPagination } from "@/components/list-pagination"
import { ListSortSelect } from "@/components/list-sort-select"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes, routeSortOptions } from "@/lib/constants"
import { createRoutesListFilterFields } from "@/lib/forms/list-filter-fields"
import {
  createListApiPath,
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
  AutoLookupOption,
  DriverLookupOption,
  ListPageState,
  LocationLookupOption,
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

  const [
    autoLookupOptionsResult,
    driverLookupOptionsResult,
    locationLookupOptionsResult,
  ] = await Promise.all([
    fetchFromApi<AutoLookupOption[]>(apiEndpoints.autoLookupOptions, authToken),
    fetchFromApi<DriverLookupOption[]>(
      apiEndpoints.driverLookupOptions,
      authToken
    ),
    fetchFromApi<LocationLookupOption[]>(
      apiEndpoints.locationLookupOptions,
      authToken
    ),
  ])

  if (
    !autoLookupOptionsResult.isSucceeded ||
    !driverLookupOptionsResult.isSucceeded ||
    !locationLookupOptionsResult.isSucceeded
  ) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-1 py-6 sm:p-8">
        <PageHeader
          title={routesPageTitle}
          description={routesPageDescription}
        />
        <LoadErrorMessage
          errorMessage={getFirstApiFetchErrorMessage([
            autoLookupOptionsResult,
            driverLookupOptionsResult,
            locationLookupOptionsResult,
          ])}
        />
      </div>
    )
  }

  const routesListFilterFields = createRoutesListFilterFields(
    autoLookupOptionsResult.data,
    driverLookupOptionsResult.data
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
    <div className="mx-auto max-w-6xl space-y-6 px-1 py-6 sm:p-8">
      <PageHeader title={routesPageTitle} description={routesPageDescription}>
        <AddRouteModal
          autoLookupOptions={autoLookupOptionsResult.data}
          driverLookupOptions={driverLookupOptionsResult.data}
          locationLookupOptions={locationLookupOptionsResult.data}
        />
      </PageHeader>

      <ListFilterPanel
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
            autoLookupOptions={autoLookupOptionsResult.data}
            driverLookupOptions={driverLookupOptionsResult.data}
            locationLookupOptions={locationLookupOptionsResult.data}
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
