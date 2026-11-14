import AddRouteModal from "@/components/add/add-route-modal"
import RoutesList from "@/components/routes-list"
import RoutesSearchForm from "@/components/routes-search-form"
import { ListPagination } from "@/components/list-pagination"
import { ListSearchForm } from "@/components/list-search-form"
import { ListSortSelect } from "@/components/list-sort-select"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes, routeSortOptions } from "@/lib/constants"
import { createRoutesSearchFormValuesFromPageSearchParams } from "@/lib/forms/routes-search-form"
import {
  createListApiPath,
  getListQueryFromPageSearchParams,
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
  const routesSearchFormValues =
    createRoutesSearchFormValuesFromPageSearchParams(pageSearchParams)
  const routesListPageState: ListPageState<RouteSortField> = {
    path: appRoutes.routes,
    listQuery: getListQueryFromPageSearchParams(
      pageSearchParams,
      RouteSortField
    ),
    filterValues: routesSearchFormValues,
  }

  const [routesPageResult, autosResult, driversResult, locationsResult] =
    await Promise.all([
      fetchFromApi<PagedList<Route>>(
        createListApiPath(
          apiEndpoints.routesPagedList,
          routesListPageState.listQuery,
          routesListPageState.filterValues
        ),
        authToken
      ),
      fetchFromApi<Auto[]>(apiEndpoints.allAutos, authToken),
      fetchFromApi<Driver[]>(apiEndpoints.allDrivers, authToken),
      fetchFromApi<Location[]>(apiEndpoints.allLocations, authToken),
    ])

  if (
    !routesPageResult.isSucceeded ||
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
            routesPageResult,
            autosResult,
            driversResult,
            locationsResult,
          ])}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <PageHeader title={routesPageTitle} description={routesPageDescription}>
        <AddRouteModal
          autos={autosResult.data}
          drivers={driversResult.data}
          locations={locationsResult.data}
        />
      </PageHeader>

      <RoutesSearchForm
        key={JSON.stringify(routesSearchFormValues)}
        initialRoutesSearchFormValues={routesSearchFormValues}
        routesListPageState={routesListPageState}
        autos={autosResult.data}
        drivers={driversResult.data}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ListSearchForm
          key={routesListPageState.listQuery.search}
          listPageState={routesListPageState}
          placeholder="Пошук за містом або країною відправлення чи прибуття..."
        />
        <ListSortSelect
          listPageState={routesListPageState}
          sortOptions={routeSortOptions}
          sortFieldEnum={RouteSortField}
        />
      </div>

      <RoutesList
        routes={routesPageResult.data.items}
        locations={locationsResult.data}
        autos={autosResult.data}
        drivers={driversResult.data}
        isRoutesListFiltered={
          routesListPageState.listQuery.search !== "" ||
          Object.values(routesListPageState.filterValues).some(
            (filterValue) => filterValue !== ""
          )
        }
      />

      <ListPagination
        listPageState={routesListPageState}
        totalCount={routesPageResult.data.totalCount}
      />
    </div>
  )
}
