import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DepotNameModal } from "@/components/depot-name-modal"
import { DeleteTableRowAction } from "@/components/tables/delete-table-row-action"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { apiEndpoints, depotsTableColumns } from "@/lib/constants"
import { Depot } from "@/lib/types"

interface DepotsTableProps {
  depots: ReadonlyArray<Depot>
}

export function DepotsTable({ depots }: DepotsTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {depotsTableColumns.map((depotsTableColumn) => (
              <TableHead
                key={depotsTableColumn.label}
                className={depotsTableColumn.className}
              >
                {depotsTableColumn.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {depots.length === 0 && (
            <EmptyTableRow
              columnCount={depotsTableColumns.length}
              message="Депо поки немає."
            />
          )}
          {depots.map((depot) => (
            <TableRow key={depot.id} className="hover:bg-slate-50/50">
              <TableCell className="font-mono text-xs">{depot.id}</TableCell>
              <TableCell className="font-medium">{depot.name}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <DepotNameModal editedDepot={depot} />
                  <DeleteTableRowAction
                    deleteApiPath={`${apiEndpoints.deleteDepot}/${depot.id}`}
                    deletionQuestion={`Видалити депо ${depot.name}? Депо можна видалити лише тоді, коли до нього не належать автомобілі, водії, маршрути та диспетчери.`}
                    deletionToastMessages={{
                      loading: "Видалення депо...",
                      success: "Депо видалено!",
                      error: "Не вдалося видалити депо",
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
