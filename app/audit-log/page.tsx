import AuditLogsTable from "@/components/tables/audit-logs-table"
import { ListFilterPanel } from "@/components/list-filter-panel"
import { ListPagination } from "@/components/list-pagination"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes } from "@/lib/constants"
import { getTranslations } from "next-intl/server"
import { createAuditLogsListFilterFields } from "@/lib/forms/list-filter-fields"
import {
  createListApiPath,
  getListFilterValuesFromPageSearchParams,
  getListQueryFromPageSearchParams,
} from "@/lib/search-params"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import { AuditLogSortField, ListPageState, PageSearchParams } from "@/lib/types"
import { createPagedListSchema } from "@/lib/schemas/paged-list-schema"
import { auditLogSchema } from "@/lib/schemas/audit-log-schema"
import { PageContainer } from "@/components/page-container"

interface AuditLogsPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function AuditLogsPage({
  searchParams,
}: AuditLogsPageProps) {
  const authToken = await getAdminAuthTokenOrRedirect()
  const pageSearchParams = await searchParams
  const translateMessage = await getTranslations()
  const auditLogsListFilterFields =
    createAuditLogsListFilterFields(translateMessage)
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
  const auditLogsPageResult = await fetchFromApi(
    createListApiPath(
      apiEndpoints.auditLogsPagedList,
      auditLogsListPageState.listQuery,
      auditLogsListPageState.filterValues
    ),
    authToken,
    createPagedListSchema(auditLogSchema)
  )

  return (
    <PageContainer>
      <PageHeader
        title={translateMessage("pages.auditLogsTitle")}
        description={translateMessage("pages.auditLogsDescription")}
      />

      <ListFilterPanel
        title={translateMessage("pages.auditLogsFilterTitle")}
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
    </PageContainer>
  )
}
