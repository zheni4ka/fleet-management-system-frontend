import DispatchersTable from "@/components/tables/dispatchers-table"
import AddDispatcherModal from "@/components/add/add-dispatcher-modal"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints } from "@/lib/constants"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import { Dispatcher } from "@/lib/types"

export default async function DispatchersPage() {
  const authToken = await getAdminAuthTokenOrRedirect()
  const dispatchersResult = await fetchFromApi<Dispatcher[]>(
    apiEndpoints.allAccounts,
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

      {dispatchersResult.isSucceeded ? (
        <DispatchersTable dispatchers={dispatchersResult.data} />
      ) : (
        <LoadErrorMessage errorMessage={dispatchersResult.errorMessage} />
      )}
    </div>
  )
}
