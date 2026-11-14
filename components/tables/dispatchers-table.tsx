"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { TableRowActionButton } from "@/components/tables/table-row-action-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { hasActiveListFilters } from "@/lib/search-params"
import {
  apiEndpoints,
  dispatchersTableColumns,
  nothingFoundMessage,
  tableRowActionLabels,
} from "@/lib/constants"
import {
  Dispatcher,
  DispatcherSortField,
  HttpMethod,
  ListPageState,
} from "@/lib/types"

interface DispatchersTableProps {
  dispatchers: Dispatcher[]
  listPageState: ListPageState<DispatcherSortField>
}

export function DispatchersTable({
  dispatchers,
  listPageState,
}: DispatchersTableProps) {
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()
  const [dispatcherPendingDeletion, setDispatcherPendingDeletion] =
    useState<Dispatcher | null>(null)

  const handleDeleteConfirm = async () => {
    if (dispatcherPendingDeletion === null) {
      return
    }
    const isDispatcherDeleted = await runApiMutation(
      () =>
        sendApiRequest(
          `${apiEndpoints.accounts}/${dispatcherPendingDeletion.id}`,
          HttpMethod.Delete
        ),
      {
        loading: "Видалення облікового запису...",
        success: "Диспетчера успішно видалено!",
        error: "Не вдалося видалити користувача",
      }
    )
    if (isDispatcherDeleted) {
      setDispatcherPendingDeletion(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableColumnsHeader
          tableColumns={dispatchersTableColumns}
          listPageState={listPageState}
        />
        <TableBody>
          {dispatchers.length === 0 && (
            <EmptyTableRow
              columnCount={dispatchersTableColumns.length}
              message={
                hasActiveListFilters(listPageState)
                  ? nothingFoundMessage
                  : "Диспетчерів поки немає."
              }
            />
          )}
          {dispatchers.map((dispatcher) => (
            <TableRow key={dispatcher.id} className="hover:bg-slate-50/50">
              <TableCell className="font-mono text-xs">
                {dispatcher.id}
              </TableCell>
              <TableCell className="font-medium">
                {dispatcher.username}
              </TableCell>
              <TableCell>{dispatcher.email ?? "—"}</TableCell>
              <TableCell className="text-center">
                <TableRowActionButton
                  icon={Trash2}
                  label={tableRowActionLabels.delete}
                  variant="destructive"
                  className="text-red-700 hover:text-red-800"
                  onClick={() => setDispatcherPendingDeletion(dispatcher)}
                  disabled={isApiMutationRunning}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteConfirmationDialog
        deletionQuestion={
          dispatcherPendingDeletion === null
            ? null
            : `Видалити диспетчера ${dispatcherPendingDeletion.username}?`
        }
        isDeleting={isApiMutationRunning}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDispatcherPendingDeletion(null)}
      />
    </div>
  )
}

export default DispatchersTable
