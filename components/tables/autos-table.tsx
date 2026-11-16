import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import EditAutoModal from "@/components/edit/edit-auto-modal"
import AutoMaintenanceManagementModal from "@/components/auto-maintenance-management-modal"
import { DeleteTableRowAction } from "@/components/tables/delete-table-row-action"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { hasActiveListFilters } from "@/lib/search-params"
import {
  apiEndpoints,
  autoStatusLabels,
  autosTableColumns,
  commonUiTexts,
} from "@/lib/constants"
import { formatAutoTitle, formatAutoTitleWithNumber } from "@/lib/formatters"
import { Auto, AutoSortField, BadgeTone, ListPageState } from "@/lib/types"

interface AutosTableProps {
  autos: Auto[]
  listPageState: ListPageState<AutoSortField>
}

export function AutosTable({ autos, listPageState }: AutosTableProps) {
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
                  ? commonUiTexts.nothingFoundMessage
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
                <Badge tone={BadgeTone.Neutral}>
                  {autoStatusLabels[auto.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge tone={BadgeTone.Info}>{auto.number}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <AutoMaintenanceManagementModal
                    autoId={auto.id}
                    autoTitle={formatAutoTitle(auto)}
                  />
                  <EditAutoModal auto={auto} />
                  <DeleteTableRowAction
                    deleteApiPath={`${apiEndpoints.deleteAuto}/${auto.id}`}
                    deletionQuestion={`Видалити авто ${formatAutoTitleWithNumber(auto)}?`}
                    deletionToastMessages={{
                      loading: "Видалення автомобіля...",
                      success: "Автомобіль успішно видалено!",
                      error: "Не вдалося видалити автомобіль",
                    }}
                  />
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
