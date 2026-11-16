import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { DeleteTableRowAction } from "@/components/tables/delete-table-row-action"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { hasActiveListFilters } from "@/lib/search-params"
import {
  apiEndpoints,
  commonUiTexts,
  dispatchersTableColumns,
} from "@/lib/constants"
import { Dispatcher, DispatcherSortField, ListPageState } from "@/lib/types"

interface DispatchersTableProps {
  dispatchers: Dispatcher[]
  listPageState: ListPageState<DispatcherSortField>
}

export function DispatchersTable({
  dispatchers,
  listPageState,
}: DispatchersTableProps) {
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
                  ? commonUiTexts.nothingFoundMessage
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
                <DeleteTableRowAction
                  deleteApiPath={`${apiEndpoints.deleteUser}/${dispatcher.id}`}
                  deletionQuestion={`Видалити диспетчера ${dispatcher.username}?`}
                  deletionToastMessages={{
                    loading: "Видалення облікового запису...",
                    success: "Диспетчера успішно видалено!",
                    error: "Не вдалося видалити користувача",
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default DispatchersTable
