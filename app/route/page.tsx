import AddRouteModal from "@/components/add/add-route-modal"
import RoutesList from "@/components/routes-list"
import { ListFilterPanel } from "@/components/list-filter-panel"
import { ListPagination } from "@/components/list-pagination"
import { ListSortSelect } from "@/components/list-sort-select"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes, routeSortOptions } from "@/lib/constants"
import { getTranslations } from "next-intl/server"
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
import { ListPageState, PageSearchParams, RouteSortField } from "@/lib/types"
import { createPagedListSchema } from "@/lib/schemas/paged-list-schema"
import { routeSchema } from "@/lib/schemas/route-schema"
import { depotsSchema } from "@/lib/schemas/depot-schema"
import { z } from "zod"
import { autoLookupOptionSchema } from "@/lib/schemas/auto-lookup-option-schema"
import { driverLookupOptionSchema } from "@/lib/schemas/driver-lookup-option-schema"
import { locationLookupOptionSchema } from "@/lib/schemas/location-lookup-option-schema"
import { PageContainer } from "@/components/page-container"
import {
  redirectToCanonicalListPageHref,
  redirectToLastListPageWhenPageOutOfRange,
} from "@/lib/server/list-page-redirects"

interface RoutesPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function RoutesPage({ searchParams }: RoutesPageProps) {
  const authToken = await getAuthTokenOrRedirect()
  const pageSearchParams = await searchParams
  const translateMessage = await getTranslations()
  const routesPageTitle = translateMessage("pages.routesTitle")
  const routesPageDescription = translateMessage("pages.routesDescription")

  const [
    autoLookupOptionsResult,
    driverLookupOptionsResult,
    locationLookupOptionsResult,
    depotsResult,
  ] = await Promise.all([
    fetchFromApi(
      apiEndpoints.autoLookupOptions,
      authToken,
      z.array(autoLookupOptionSchema)
    ),
    fetchFromApi(
      apiEndpoints.driverLookupOptions,
      authToken,
      z.array(driverLookupOptionSchema)
    ),
    fetchFromApi(
      apiEndpoints.locationLookupOptions,
      authToken,
      z.array(locationLookupOptionSchema)
    ),
    fetchFromApi(apiEndpoints.depots, authToken, depotsSchema),
  ])

  if (
    !autoLookupOptionsResult.isSucceeded ||
    !driverLookupOptionsResult.isSucceeded ||
    !locationLookupOptionsResult.isSucceeded ||
    !depotsResult.isSucceeded
  ) {
    return (
      <PageContainer>
        <PageHeader
          title={routesPageTitle}
          description={routesPageDescription}
        />
        <LoadErrorMessage
          errorMessage={getFirstApiFetchErrorMessage([
            autoLookupOptionsResult,
            driverLookupOptionsResult,
            locationLookupOptionsResult,
            depotsResult,
          ])}
        />
      </PageContainer>
    )
  }

  const routesListFilterFields = createRoutesListFilterFields(
    autoLookupOptionsResult.data,
    driverLookupOptionsResult.data,
    depotsResult.data,
    translateMessage
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
  redirectToCanonicalListPageHref(routesListPageState, pageSearchParams)
  const routesPageResult = await fetchFromApi(
    createListApiPath(
      apiEndpoints.routesPagedList,
      routesListPageState.listQuery,
      routesListPageState.filterValues
    ),
    authToken,
    createPagedListSchema(routeSchema)
  )
  if (routesPageResult.isSucceeded) {
    redirectToLastListPageWhenPageOutOfRange(
      routesListPageState,
      routesPageResult.data.totalCount
    )
  }

  return (
    <PageContainer>
      <PageHeader title={routesPageTitle} description={routesPageDescription}>
        <AddRouteModal
          autoLookupOptions={autoLookupOptionsResult.data}
          driverLookupOptions={driverLookupOptionsResult.data}
          locationLookupOptions={locationLookupOptionsResult.data}
        />
      </PageHeader>

      <ListFilterPanel
        title={translateMessage("pages.routesFilterTitle")}
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
            key={routesPageResult.data.items
              .map((route) => `${route.id}:${route.status}`)
              .join("|")}
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
    </PageContainer>
  )
}
