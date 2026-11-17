import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTranslations } from "next-intl"
import { DepotNameModal } from "@/components/depot-name-modal"
import { DeleteTableRowAction } from "@/components/tables/delete-table-row-action"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { apiEndpoints, depotsTableColumns } from "@/lib/constants"
import { Depot } from "@/lib/types"

interface DepotsTableProps {
  depots: ReadonlyArray<Depot>
}

export function DepotsTable({ depots }: DepotsTableProps) {
  const tableColumnsTranslations = useTranslations("tableColumns")
  const depotTranslations = useTranslations("depots")
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {depotsTableColumns.map((depotsTableColumn) => (
              <TableHead
                key={depotsTableColumn.labelMessageKey}
                className={depotsTableColumn.className}
              >
                {tableColumnsTranslations(depotsTableColumn.labelMessageKey)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {depots.length === 0 && (
            <EmptyTableRow
              columnCount={depotsTableColumns.length}
              message={depotTranslations("emptyList")}
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
                    deletionQuestion={depotTranslations("deletionQuestion", {
                      depotName: depot.name,
                    })}
                    deletionToastMessages={{
                      loading: depotTranslations("deleteLoading"),
                      success: depotTranslations("deleteSuccess"),
                      error: depotTranslations("deleteError"),
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
