import LocationsTable from "@/components/tables/locations-table"
import AddLocationModal from "@/components/add/add-location-modal"
import { ListPagination } from "@/components/list-pagination"
import { ListSearchForm } from "@/components/list-search-form"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes } from "@/lib/constants"
import {
  createListApiPath,
  getListQueryFromPageSearchParams,
} from "@/lib/search-params"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import {
  ListPageState,
  Location,
  LocationSortField,
  PageSearchParams,
  PagedList,
} from "@/lib/types"

interface LocationsPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function LocationsPage({
  searchParams,
}: LocationsPageProps) {
  const authToken = await getAdminAuthTokenOrRedirect()
  const locationsListPageState: ListPageState<LocationSortField> = {
    path: appRoutes.locations,
    listQuery: getListQueryFromPageSearchParams(
      await searchParams,
      LocationSortField
    ),
    filterValues: {},
  }
  const locationsPageResult = await fetchFromApi<PagedList<Location>>(
    createListApiPath(
      apiEndpoints.locationsPagedList,
      locationsListPageState.listQuery
    ),
    authToken
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <PageHeader
        title="Локації"
        description="Довідник міст і країн, між якими прокладаються маршрути."
      >
        <AddLocationModal />
      </PageHeader>

      <ListSearchForm
        key={locationsListPageState.listQuery.search}
        listPageState={locationsListPageState}
        placeholder="Пошук локації (місто, країна)..."
      />

      {locationsPageResult.isSucceeded ? (
        <>
          <LocationsTable
            locations={locationsPageResult.data.items}
            listPageState={locationsListPageState}
          />
          <ListPagination
            listPageState={locationsListPageState}
            totalCount={locationsPageResult.data.totalCount}
          />
        </>
      ) : (
        <LoadErrorMessage errorMessage={locationsPageResult.errorMessage} />
      )}
    </div>
  )
}
