import AuditLogsTable from "@/components/tables/audit-logs-table"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints } from "@/lib/constants"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import { AuditLog } from "@/lib/types"

export default async function AuditLogsPage() {
  const authToken = await getAdminAuthTokenOrRedirect()
  const auditLogsResult = await fetchFromApi<AuditLog[]>(
    apiEndpoints.allAuditLogs,
    authToken
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <PageHeader
        title="Журнал дій"
        description="Історія змін у системі: хто, коли і що створив, змінив або видалив."
      />

      {auditLogsResult.isSucceeded ? (
        <AuditLogsTable auditLogs={auditLogsResult.data} />
      ) : (
        <LoadErrorMessage errorMessage={auditLogsResult.errorMessage} />
      )}
    </div>
  )
}
