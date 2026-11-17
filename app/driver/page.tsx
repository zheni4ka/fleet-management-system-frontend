import DriversTable from "@/components/tables/drivers-table"
import AddDriverModal from "@/components/add/add-driver-modal"
import { ListFilterPanel } from "@/components/list-filter-panel"
import { ListPagination } from "@/components/list-pagination"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes } from "@/lib/constants"
import { getTranslations } from "next-intl/server"
import { createDriversListFilterFields } from "@/lib/forms/list-filter-fields"
import {
  createListApiPath,
  getListFilterValuesFromPageSearchParams,
  getListQueryFromPageSearchParams,
} from "@/lib/search-params"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import { DriverSortField, ListPageState, PageSearchParams } from "@/lib/types"
import { createPagedListSchema } from "@/lib/schemas/paged-list-schema"
import { driverSchema } from "@/lib/schemas/driver-schema"
import { depotsSchema } from "@/lib/schemas/depot-schema"
import { PageContainer } from "@/components/page-container"

interface DriversPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function DriversPage({ searchParams }: DriversPageProps) {
  const authToken = await getAdminAuthTokenOrRedirect()
  const pageSearchParams = await searchParams
  const translateMessage = await getTranslations()
  const driversPageTitle = translateMessage("pages.driversTitle")
  const driversPageDescription = translateMessage("pages.driversDescription")
  const depotsResult = await fetchFromApi(
    apiEndpoints.depots,
    authToken,
    depotsSchema
  )
  if (!depotsResult.isSucceeded) {
    return (
      <PageContainer>
        <PageHeader
          title={driversPageTitle}
          description={driversPageDescription}
        />
        <LoadErrorMessage errorMessage={depotsResult.errorMessage} />
      </PageContainer>
    )
  }

  const driversListFilterFields = createDriversListFilterFields(
    depotsResult.data,
    translateMessage
  )
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
      <PageHeader title={driversPageTitle} description={driversPageDescription}>
        <AddDriverModal depots={depotsResult.data} />
      </PageHeader>

      <ListFilterPanel
        title={translateMessage("pages.driversFilterTitle")}
        listPageState={driversListPageState}
        listFilterFields={driversListFilterFields}
      />

      {driversPageResult.isSucceeded ? (
        <>
          <DriversTable
            drivers={driversPageResult.data.items}
            depots={depotsResult.data}
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
