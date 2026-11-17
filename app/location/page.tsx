import LocationsTable from "@/components/tables/locations-table"
import AddLocationModal from "@/components/add/add-location-modal"
import { ListFilterPanel } from "@/components/list-filter-panel"
import { ListPagination } from "@/components/list-pagination"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes } from "@/lib/constants"
import { getTranslations } from "next-intl/server"
import { createLocationsListFilterFields } from "@/lib/forms/list-filter-fields"
import {
  createListApiPath,
  getListFilterValuesFromPageSearchParams,
  getListQueryFromPageSearchParams,
} from "@/lib/search-params"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import { ListPageState, LocationSortField, PageSearchParams } from "@/lib/types"
import { createPagedListSchema } from "@/lib/schemas/paged-list-schema"
import { locationSchema } from "@/lib/schemas/location-schema"
import { PageContainer } from "@/components/page-container"

interface LocationsPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function LocationsPage({
  searchParams,
}: LocationsPageProps) {
  const authToken = await getAdminAuthTokenOrRedirect()
  const pageSearchParams = await searchParams
  const translateMessage = await getTranslations()
  const locationsListFilterFields =
    createLocationsListFilterFields(translateMessage)
  const locationsListPageState: ListPageState<LocationSortField> = {
    path: appRoutes.locations,
    listQuery: getListQueryFromPageSearchParams(
      pageSearchParams,
      LocationSortField
    ),
    filterValues: getListFilterValuesFromPageSearchParams(
      pageSearchParams,
      locationsListFilterFields
    ),
  }
  const locationsPageResult = await fetchFromApi(
    createListApiPath(
      apiEndpoints.locationsPagedList,
      locationsListPageState.listQuery,
      locationsListPageState.filterValues
    ),
    authToken,
    createPagedListSchema(locationSchema)
  )

  return (
    <PageContainer>
      <PageHeader
        title={translateMessage("pages.locationsTitle")}
        description={translateMessage("pages.locationsDescription")}
      >
        <AddLocationModal />
      </PageHeader>

      <ListFilterPanel
        title={translateMessage("pages.locationsFilterTitle")}
        listPageState={locationsListPageState}
        listFilterFields={locationsListFilterFields}
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
    </PageContainer>
  )
}
