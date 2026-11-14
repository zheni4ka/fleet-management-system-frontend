import DispatchersTable from "@/components/tables/dispatchers-table"
import AddDispatcherModal from "@/components/add/add-dispatcher-modal"
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
  Dispatcher,
  DispatcherSortField,
  ListPageState,
  PageSearchParams,
  PagedList,
} from "@/lib/types"

interface DispatchersPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function DispatchersPage({
  searchParams,
}: DispatchersPageProps) {
  const authToken = await getAdminAuthTokenOrRedirect()
  const dispatchersListPageState: ListPageState<DispatcherSortField> = {
    path: appRoutes.dispatchers,
    listQuery: getListQueryFromPageSearchParams(
      await searchParams,
      DispatcherSortField
    ),
    filterValues: {},
  }
  const dispatchersPageResult = await fetchFromApi<PagedList<Dispatcher>>(
    createListApiPath(
      apiEndpoints.dispatchersPagedList,
      dispatchersListPageState.listQuery
    ),
    authToken
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <PageHeader
        title="Диспетчери"
        description="Управління обліковими записами персоналу."
      >
        <AddDispatcherModal />
      </PageHeader>

      <ListSearchForm
        key={dispatchersListPageState.listQuery.search}
        listPageState={dispatchersListPageState}
        placeholder="Пошук диспетчера (логін, email)..."
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
    </div>
  )
}
