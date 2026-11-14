"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints, dispatchersTableColumns } from "@/lib/constants"
import { Dispatcher, HttpMethod } from "@/lib/types"
import { isMatchingSearchQuery } from "@/lib/utils"

interface DispatchersTableProps {
  dispatchers: Dispatcher[]
}

export function DispatchersTable({ dispatchers }: DispatchersTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const filteredDispatchers = dispatchers.filter((dispatcher) =>
    isMatchingSearchQuery(searchQuery, [dispatcher.username, dispatcher.email])
  )

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
    <div className="space-y-4">
      <Input
        placeholder="Пошук диспетчера..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="max-w-sm bg-white shadow-sm"
      />

      <div className="overflow-hidden rounded-md border bg-white">
        <Table>
          <TableColumnsHeader tableColumns={dispatchersTableColumns} />
          <TableBody>
            {filteredDispatchers.length === 0 && (
              <EmptyTableRow
                columnCount={dispatchersTableColumns.length}
                message={
                  dispatchers.length === 0
                    ? "Диспетчерів поки немає."
                    : "Нічого не знайдено."
                }
              />
            )}
            {filteredDispatchers.map((dispatcher) => (
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
    </div>
  )
}

export default DispatchersTable
