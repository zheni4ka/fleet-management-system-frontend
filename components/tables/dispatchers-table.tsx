"use client"

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
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

  const handleDelete = async (dispatcherId: string) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цього диспетчера?")) {
      return
    }
    await runApiMutation(
      () =>
        sendApiRequest(
          `${apiEndpoints.accounts}/${dispatcherId}`,
          HttpMethod.Delete
        ),
      {
        loading: "Видалення облікового запису...",
        success: "Диспетчера успішно видалено!",
        error: "Не вдалося видалити користувача",
      }
    )
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
                listPageState.listQuery.search === ""
                  ? "Диспетчерів поки немає."
                  : nothingFoundMessage
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
                  onClick={() => handleDelete(dispatcher.id)}
                  disabled={isApiMutationRunning}
                >
                  Видалити
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default DispatchersTable
