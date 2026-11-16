import DriversTable from "@/components/tables/drivers-table"
import AddDriverModal from "@/components/add/add-driver-modal"
import { ListFilterPanel } from "@/components/list-filter-panel"
import { ListPagination } from "@/components/list-pagination"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes } from "@/lib/constants"
import { driversListFilterFields } from "@/lib/forms/list-filter-fields"
import {
  createListApiPath,
  getListFilterValuesFromPageSearchParams,
  getListQueryFromPageSearchParams,
} from "@/lib/search-params"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import { DriverSortField, ListPageState, PageSearchParams } from "@/lib/types"
import { createPagedListSchema } from "@/lib/schemas/paged-list-schema"
import { driverSchema } from "@/lib/schemas/driver-schema"
import { PageContainer } from "@/components/page-container"

interface DriversPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function DriversPage({ searchParams }: DriversPageProps) {
  const authToken = await getAdminAuthTokenOrRedirect()
  const pageSearchParams = await searchParams
  const driversListPageState: ListPageState<DriverSortField> = {
    path: appRoutes.drivers,
    listQuery: getListQueryFromPageSearchParams(
      pageSearchParams,
      DriverSortField
    ),
    filterValues: getListFilterValuesFromPageSearchParams(
      pageSearchParams,
      driversListFilterFields
    ),
  }
  const driversPageResult = await fetchFromApi(
    createListApiPath(
      apiEndpoints.driversPagedList,
      driversListPageState.listQuery,
      driversListPageState.filterValues
    ),
    authToken,
    createPagedListSchema(driverSchema)
  )

  return (
    <PageContainer>
      <PageHeader
        title="Водії"
        description="Управління водіями вашого автопарку та перегляд їхніх ліцензій."
      >
        <AddDriverModal />
      </PageHeader>

      <ListFilterPanel
        title="Пошук водіїв"
        listPageState={driversListPageState}
        listFilterFields={driversListFilterFields}
      />

      {driversPageResult.isSucceeded ? (
        <>
          <DriversTable
            drivers={driversPageResult.data.items}
            listPageState={driversListPageState}
          />
          <ListPagination
            listPageState={driversListPageState}
            totalCount={driversPageResult.data.totalCount}
          />
        </>
      ) : (
        <LoadErrorMessage errorMessage={driversPageResult.errorMessage} />
      )}
    </PageContainer>
  )
}
