import AuditLogsTable from "@/components/tables/audit-logs-table"
import { ListFilterForm } from "@/components/list-filter-form"
import { ListPagination } from "@/components/list-pagination"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes } from "@/lib/constants"
import { auditLogsListFilterFields } from "@/lib/forms/list-filter-fields"
import {
  createListApiPath,
  createListPageHref,
  getListFilterValuesFromPageSearchParams,
  getListQueryFromPageSearchParams,
} from "@/lib/search-params"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import {
  AuditLog,
  AuditLogSortField,
  ListPageState,
  PageSearchParams,
  PagedList,
} from "@/lib/types"

interface AuditLogsPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function AuditLogsPage({
  searchParams,
}: AuditLogsPageProps) {
  const authToken = await getAdminAuthTokenOrRedirect()
  const pageSearchParams = await searchParams
  const auditLogsListPageState: ListPageState<AuditLogSortField> = {
    path: appRoutes.auditLogs,
    listQuery: getListQueryFromPageSearchParams(
      pageSearchParams,
      AuditLogSortField
    ),
    filterValues: getListFilterValuesFromPageSearchParams(
      pageSearchParams,
      auditLogsListFilterFields
    ),
  }
  const auditLogsPageResult = await fetchFromApi<PagedList<AuditLog>>(
    createListApiPath(
      apiEndpoints.auditLogsPagedList,
      auditLogsListPageState.listQuery,
      auditLogsListPageState.filterValues
    ),
    authToken
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <PageHeader
        title="Журнал дій"
        description="Історія змін у системі: хто, коли і що створив, змінив або видалив."
      />

      <ListFilterForm
        key={createListPageHref(auditLogsListPageState, {})}
        title="Пошук у журналі дій"
        listPageState={auditLogsListPageState}
        listFilterFields={auditLogsListFilterFields}
      />

      {auditLogsPageResult.isSucceeded ? (
        <>
          <AuditLogsTable
            auditLogs={auditLogsPageResult.data.items}
            listPageState={auditLogsListPageState}
          />
          <ListPagination
            listPageState={auditLogsListPageState}
            totalCount={auditLogsPageResult.data.totalCount}
          />
        </>
      ) : (
        <LoadErrorMessage errorMessage={auditLogsPageResult.errorMessage} />
      )}
    </div>
  )
}
