import DriversTable from "@/components/tables/drivers-table"
import AddDriverModal from "@/components/add/add-driver-modal"
import { ListFilterForm } from "@/components/list-filter-form"
import { ListPagination } from "@/components/list-pagination"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes } from "@/lib/constants"
import { driversListFilterFields } from "@/lib/forms/list-filter-fields"
import {
  createListApiPath,
  createListPageHref,
  getListFilterValuesFromPageSearchParams,
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
  const driversPageResult = await fetchFromApi<PagedList<Driver>>(
    createListApiPath(
      apiEndpoints.driversPagedList,
      driversListPageState.listQuery,
      driversListPageState.filterValues
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

      <ListFilterForm
        key={createListPageHref(driversListPageState, {})}
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
    </div>
  )
}
