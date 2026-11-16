import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import {
  auditActionLabels,
  auditLogsTableColumns,
  commonUiTexts,
} from "@/lib/constants"
import { formatDateTime } from "@/lib/formatters"
import { hasActiveListFilters } from "@/lib/search-params"
import { AuditLog, AuditLogSortField, ListPageState } from "@/lib/types"

interface AuditLogsTableProps {
  auditLogs: AuditLog[]
  listPageState: ListPageState<AuditLogSortField>
}

export function AuditLogsTable({
  auditLogs,
  listPageState,
}: AuditLogsTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableColumnsHeader
          tableColumns={auditLogsTableColumns}
          listPageState={listPageState}
        />
        <TableBody>
          {auditLogs.length === 0 && (
            <EmptyTableRow
              columnCount={auditLogsTableColumns.length}
              message={
                hasActiveListFilters(listPageState)
                  ? commonUiTexts.nothingFoundMessage
                  : "Журнал дій поки порожній."
              }
            />
          )}
          {auditLogs.map((auditLog) => (
            <TableRow key={auditLog.id} className="hover:bg-slate-50/50">
              <TableCell className="text-xs">
                {formatDateTime(auditLog.time)}
              </TableCell>
              <TableCell className="font-medium">
                {auditActionLabels[auditLog.action]}
              </TableCell>
              <TableCell>
                {auditLog.dispatcherUsername ?? (
                  <span className="text-slate-500 italic">
                    {commonUiTexts.deletedUserLabel}
                  </span>
                )}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {auditLog.entityId ?? "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AuditLogsTable
