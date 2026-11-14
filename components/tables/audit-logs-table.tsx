"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import {
  auditActionLabels,
  auditLogsTableColumns,
  deletedUserLabel,
} from "@/lib/constants"
import { formatDateTime } from "@/lib/formatters"
import { AuditAction, AuditLog } from "@/lib/types"
import { isMatchingSearchQuery, parseEnumValue } from "@/lib/utils"

interface AuditLogsTableProps {
  auditLogs: AuditLog[]
}

export function AuditLogsTable({ auditLogs }: AuditLogsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAuditAction, setSelectedAuditAction] =
    useState<AuditAction | null>(null)

  const filteredAuditLogs = auditLogs.filter(
    (auditLog) =>
      (selectedAuditAction === null ||
        auditLog.action === selectedAuditAction) &&
      isMatchingSearchQuery(searchQuery, [
        auditLog.dispatcherUsername,
        auditLog.entityId,
        auditActionLabels[auditLog.action],
      ])
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Пошук (користувач, дія, ID об'єкта)..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="max-w-sm bg-white shadow-sm"
        />
        <NativeSelect
          value={selectedAuditAction ?? ""}
          onChange={(event) =>
            setSelectedAuditAction(
              event.target.value === ""
                ? null
                : parseEnumValue(AuditAction, event.target.value)
            )
          }
          className="max-w-xs shadow-sm"
        >
          <option value="">Усі дії</option>
          {Object.values(AuditAction).map((auditAction) => (
            <option key={auditAction} value={auditAction}>
              {auditActionLabels[auditAction]}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="overflow-hidden rounded-md border bg-white">
        <Table>
          <TableColumnsHeader tableColumns={auditLogsTableColumns} />
          <TableBody>
            {filteredAuditLogs.length === 0 && (
              <EmptyTableRow
                columnCount={auditLogsTableColumns.length}
                message={
                  auditLogs.length === 0
                    ? "Журнал дій поки порожній."
                    : "Нічого не знайдено за вашим запитом."
                }
              />
            )}
            {filteredAuditLogs.map((auditLog) => (
              <TableRow key={auditLog.id} className="hover:bg-slate-50/50">
                <TableCell className="text-xs">
                  {formatDateTime(auditLog.time)}
                </TableCell>
                <TableCell className="font-medium">
                  {auditActionLabels[auditLog.action]}
                </TableCell>
                <TableCell>
                  {auditLog.dispatcherUsername ?? (
                    <span className="text-slate-400 italic">
                      {deletedUserLabel}
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
    </div>
  )
}

export default AuditLogsTable
