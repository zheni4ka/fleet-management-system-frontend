import DispatchersTable from "@/components/tables/dispatchers-table"
import AddDispatcherModal from "@/components/add/add-dispatcher-modal"
import { ListFilterPanel } from "@/components/list-filter-panel"
import { ListPagination } from "@/components/list-pagination"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes } from "@/lib/constants"
import { dispatchersListFilterFields } from "@/lib/forms/list-filter-fields"
import {
  createListApiPath,
  getListFilterValuesFromPageSearchParams,
  getListQueryFromPageSearchParams,
} from "@/lib/search-params"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import {
  DispatcherSortField,
  ListPageState,
  PageSearchParams,
} from "@/lib/types"
import { createPagedListSchema } from "@/lib/schemas/paged-list-schema"
import { dispatcherSchema } from "@/lib/schemas/dispatcher-schema"
import { PageContainer } from "@/components/page-container"

interface DispatchersPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function DispatchersPage({
  searchParams,
}: DispatchersPageProps) {
  const authToken = await getAdminAuthTokenOrRedirect()
  const pageSearchParams = await searchParams
  const dispatchersListPageState: ListPageState<DispatcherSortField> = {
    path: appRoutes.dispatchers,
    listQuery: getListQueryFromPageSearchParams(
      pageSearchParams,
      DispatcherSortField
    ),
    filterValues: getListFilterValuesFromPageSearchParams(
      pageSearchParams,
      dispatchersListFilterFields
    ),
  }
  const dispatchersPageResult = await fetchFromApi(
    createListApiPath(
      apiEndpoints.dispatchersPagedList,
      dispatchersListPageState.listQuery,
      dispatchersListPageState.filterValues
    ),
    authToken,
    createPagedListSchema(dispatcherSchema)
  )

  return (
    <PageContainer>
      <PageHeader
        title="Диспетчери"
        description="Управління обліковими записами персоналу."
      >
        <AddDispatcherModal />
      </PageHeader>

      <ListFilterPanel
        title="Пошук диспетчерів"
        listPageState={dispatchersListPageState}
        listFilterFields={dispatchersListFilterFields}
      />

      {dispatchersPageResult.isSucceeded ? (
        <>
          <DispatchersTable
            dispatchers={dispatchersPageResult.data.items}
            listPageState={dispatchersListPageState}
          />
          <ListPagination
            listPageState={dispatchersListPageState}
            totalCount={dispatchersPageResult.data.totalCount}
          />
        </>
      ) : (
        <LoadErrorMessage errorMessage={dispatchersPageResult.errorMessage} />
      )}
    </PageContainer>
  )
}
