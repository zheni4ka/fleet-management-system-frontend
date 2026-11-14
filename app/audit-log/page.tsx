import AuditLogsTable from "@/components/tables/audit-logs-table"
import { AuditLogActionSelect } from "@/components/audit-log-action-select"
import { ListPagination } from "@/components/list-pagination"
import { ListSearchForm } from "@/components/list-search-form"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import {
  apiEndpoints,
  appRoutes,
  auditLogFilterSearchParamNames,
} from "@/lib/constants"
import {
  createListApiPath,
  getListQueryFromPageSearchParams,
  getPageSearchParamValue,
} from "@/lib/search-params"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import {
  AuditAction,
  AuditLog,
  AuditLogSortField,
  ListPageState,
  PageSearchParams,
  PagedList,
} from "@/lib/types"
import { findEnumValue } from "@/lib/utils"

interface AuditLogsPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function AuditLogsPage({
  searchParams,
}: AuditLogsPageProps) {
  const authToken = await getAdminAuthTokenOrRedirect()
  const pageSearchParams = await searchParams
  const selectedAuditAction = findEnumValue(
    AuditAction,
    getPageSearchParamValue(
      pageSearchParams,
      auditLogFilterSearchParamNames.action
    )
  )
  const auditLogsListPageState: ListPageState<AuditLogSortField> = {
    path: appRoutes.auditLogs,
    listQuery: getListQueryFromPageSearchParams(
      pageSearchParams,
      AuditLogSortField
    ),
    filterValues: {
      [auditLogFilterSearchParamNames.action]: selectedAuditAction ?? "",
    },
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

      <div className="flex flex-wrap gap-3">
        <ListSearchForm
          key={auditLogsListPageState.listQuery.search}
          listPageState={auditLogsListPageState}
          placeholder="Пошук (користувач, ID об'єкта)..."
        />
        <AuditLogActionSelect
          listPageState={auditLogsListPageState}
          selectedAuditAction={selectedAuditAction}
        />
      </div>

      {auditLogsPageResult.isSucceeded ? (
        <>
          <AuditLogsTable
            auditLogs={auditLogsPageResult.data.items}
            listPageState={auditLogsListPageState}
            isAuditLogsListFiltered={
              selectedAuditAction !== null ||
              auditLogsListPageState.listQuery.search !== ""
            }
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
