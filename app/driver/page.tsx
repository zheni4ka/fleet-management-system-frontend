import DriversTable from "@/components/tables/drivers-table"
import AddDriverModal from "@/components/add/add-driver-modal"
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
  Driver,
  DriverSortField,
  ListPageState,
  PageSearchParams,
  PagedList,
} from "@/lib/types"

interface DriversPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function DriversPage({ searchParams }: DriversPageProps) {
  const authToken = await getAdminAuthTokenOrRedirect()
  const driversListPageState: ListPageState<DriverSortField> = {
    path: appRoutes.drivers,
    listQuery: getListQueryFromPageSearchParams(
      await searchParams,
      DriverSortField
    ),
    filterValues: {},
  }
  const driversPageResult = await fetchFromApi<PagedList<Driver>>(
    createListApiPath(
      apiEndpoints.driversPagedList,
      driversListPageState.listQuery
    ),
    authToken
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <PageHeader
        title="Водії"
        description="Управління водіями вашого автопарку та перегляд їхніх ліцензій."
      >
        <AddDriverModal />
      </PageHeader>

      <ListSearchForm
        key={driversListPageState.listQuery.search}
        listPageState={driversListPageState}
        placeholder="Пошук водія (ім'я, прізвище, ліцензія)..."
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
    </div>
  )
}
