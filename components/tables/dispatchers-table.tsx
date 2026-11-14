"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { hasActiveListFilters } from "@/lib/search-params"
import {
  apiEndpoints,
  dispatchersTableColumns,
  nothingFoundMessage,
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
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDispatcherPendingDeletion(dispatcher)}
                  disabled={isApiMutationRunning}
                >
                  Видалити
                </Button>
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
