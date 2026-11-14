"use client"

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import EditAutoModal from "@/components/edit/edit-auto-modal"
import AutoMaintenanceModal from "@/components/add/add-maintenance-modal"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { hasActiveListFilters } from "@/lib/search-params"
import {
  apiEndpoints,
  autoStatusLabels,
  autosTableColumns,
  nothingFoundMessage,
} from "@/lib/constants"
import { formatAutoTitle } from "@/lib/formatters"
import { Auto, AutoSortField, HttpMethod, ListPageState } from "@/lib/types"

interface AutosTableProps {
  autos: Auto[]
  listPageState: ListPageState<AutoSortField>
}

export function AutosTable({ autos, listPageState }: AutosTableProps) {
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const handleDelete = async (autoId: number) => {
    if (!window.confirm("Ви впевнені, що хочете видалити автомобіль?")) {
      return
    }
    await runApiMutation(
      () =>
        sendApiRequest(`${apiEndpoints.autos}/${autoId}`, HttpMethod.Delete),
      {
        loading: "Видалення автомобіля...",
        success: "Автомобіль успішно видалено!",
        error: "Не вдалося видалити автомобіль",
      }
    )
  }

  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableColumnsHeader
          tableColumns={autosTableColumns}
          listPageState={listPageState}
        />
        <TableBody>
          {autos.length === 0 && (
            <EmptyTableRow
              columnCount={autosTableColumns.length}
              message={
                hasActiveListFilters(listPageState)
                  ? nothingFoundMessage
                  : "Автомобілів поки немає в системі."
              }
            />
          )}
          {autos.map((auto) => (
            <TableRow key={auto.id} className="hover:bg-slate-50/50">
              <TableCell className="font-mono text-xs">{auto.id}</TableCell>
              <TableCell className="font-medium">{auto.mark}</TableCell>
              <TableCell>{auto.model}</TableCell>
              <TableCell>{auto.color}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-700/10 ring-inset">
                  {autoStatusLabels[auto.status]}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                  {auto.number}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <AutoMaintenanceModal
                    autoId={auto.id}
                    autoTitle={formatAutoTitle(auto)}
                  />
                  <EditAutoModal auto={auto} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(auto.id)}
                    disabled={isApiMutationRunning}
                  >
                    Видалити
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AutosTable
