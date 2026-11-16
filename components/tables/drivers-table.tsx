import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import EditDriverModal from "@/components/edit/edit-driver-modal"
import { DeleteTableRowAction } from "@/components/tables/delete-table-row-action"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { formatDriverFullName } from "@/lib/formatters"
import { hasActiveListFilters } from "@/lib/search-params"
import {
  apiEndpoints,
  commonUiTexts,
  driversTableColumns,
} from "@/lib/constants"
import { BadgeTone, Driver, DriverSortField, ListPageState } from "@/lib/types"

interface DriversTableProps {
  drivers: Driver[]
  listPageState: ListPageState<DriverSortField>
}

export function DriversTable({ drivers, listPageState }: DriversTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableColumnsHeader
          tableColumns={driversTableColumns}
          listPageState={listPageState}
        />
        <TableBody>
          {drivers.length === 0 && (
            <EmptyTableRow
              columnCount={driversTableColumns.length}
              message={
                hasActiveListFilters(listPageState)
                  ? commonUiTexts.nothingFoundMessage
                  : "Водіїв поки немає в системі."
              }
            />
          )}
          {drivers.map((driver) => (
            <TableRow key={driver.id} className="hover:bg-slate-50/50">
              <TableCell className="font-mono text-xs">{driver.id}</TableCell>
              <TableCell className="font-medium">{driver.name}</TableCell>
              <TableCell>{driver.surname}</TableCell>
              <TableCell>{driver.patronymic}</TableCell>
              <TableCell>
                <Badge tone={BadgeTone.Info}>{driver.licenseNumber}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <EditDriverModal driver={driver} />
                  <DeleteTableRowAction
                    deleteApiPath={`${apiEndpoints.deleteDriver}/${driver.id}`}
                    deletionQuestion={`Видалити водія ${formatDriverFullName(driver)} (${driver.licenseNumber})?`}
                    deletionToastMessages={{
                      loading: "Видалення водія...",
                      success: "Водія успішно видалено!",
                      error: "Не вдалося видалити водія",
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

export default DriversTable
