import { useLocale, useTranslations } from "next-intl"
import { resolveAppLocale } from "@/lib/app-locale"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { auditLogsTableColumns } from "@/lib/constants"
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
  const appLocale = resolveAppLocale(useLocale())
  const auditActionTranslations = useTranslations("auditAction")
  const auditLogTranslations = useTranslations("auditLogs")
  const commonTranslations = useTranslations("common")
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
                  ? commonTranslations("nothingFoundMessage")
                  : auditLogTranslations("emptyList")
              }
            />
          )}
          {auditLogs.map((auditLog) => (
            <TableRow key={auditLog.id} className="hover:bg-slate-50/50">
              <TableCell className="text-xs">
                {formatDateTime(auditLog.time, appLocale)}
              </TableCell>
              <TableCell className="font-medium">
                {auditActionTranslations(auditLog.action)}
              </TableCell>
              <TableCell>
                {auditLog.dispatcherUsername ?? (
                  <span className="text-slate-500 italic">
                    {commonTranslations("deletedUserLabel")}
                  </span>
                )}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {auditLog.entityId ?? "—"}
              </TableCell>
              <TableCell className="text-xs">
                {auditLog.changes.length === 0 ? (
                  "—"
                ) : (
                  <ul className="flex flex-col gap-0.5">
                    {auditLog.changes.map((auditLogPropertyChange) => (
                      <li key={auditLogPropertyChange.propertyName}>
                        <span className="font-medium">
                          {auditLogPropertyChange.propertyName}
                        </span>
                        : {auditLogPropertyChange.previousValue ?? "—"} →{" "}
                        {auditLogPropertyChange.currentValue ?? "—"}
                      </li>
                    ))}
                  </ul>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AuditLogsTable
