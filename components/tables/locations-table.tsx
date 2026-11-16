import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { DeleteTableRowAction } from "@/components/tables/delete-table-row-action"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { formatLocationName } from "@/lib/formatters"
import { hasActiveListFilters } from "@/lib/search-params"
import {
  apiEndpoints,
  commonUiTexts,
  locationsTableColumns,
} from "@/lib/constants"
import { ListPageState, Location, LocationSortField } from "@/lib/types"

interface LocationsTableProps {
  locations: Location[]
  listPageState: ListPageState<LocationSortField>
}

export function LocationsTable({
  locations,
  listPageState,
}: LocationsTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableColumnsHeader
          tableColumns={locationsTableColumns}
          listPageState={listPageState}
        />
        <TableBody>
          {locations.length === 0 && (
            <EmptyTableRow
              columnCount={locationsTableColumns.length}
              message={
                hasActiveListFilters(listPageState)
                  ? commonUiTexts.nothingFoundMessage
                  : "Локацій поки немає в системі."
              }
            />
          )}
          {locations.map((location) => (
            <TableRow key={location.id} className="hover:bg-slate-50/50">
              <TableCell className="font-mono text-xs">{location.id}</TableCell>
              <TableCell className="font-medium">{location.city}</TableCell>
              <TableCell>{location.country}</TableCell>
              <TableCell className="text-center">
                <DeleteTableRowAction
                  deleteApiPath={`${apiEndpoints.deleteLocation}/${location.id}`}
                  deletionQuestion={`Видалити локацію ${formatLocationName(location)}?`}
                  deletionToastMessages={{
                    loading: "Видалення локації...",
                    success: "Локацію успішно видалено!",
                    error: "Не вдалося видалити локацію",
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

export default LocationsTable
