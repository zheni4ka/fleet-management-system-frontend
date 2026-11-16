import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArchivableTableRowActions } from "@/components/tables/archivable-table-row-actions"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { formatLocationName } from "@/lib/formatters"
import { hasActiveListFilters } from "@/lib/search-params"
import {
  apiEndpoints,
  commonUiTexts,
  locationsTableColumns,
  listFilterTexts,
} from "@/lib/constants"
import {
  BadgeTone,
  ListPageState,
  Location,
  LocationSortField,
} from "@/lib/types"

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
              <TableCell className="font-medium">
                {location.city}
                {location.isArchived && (
                  <span className="ml-2">
                    <Badge tone={BadgeTone.Neutral}>
                      {listFilterTexts.archivedBadgeLabel}
                    </Badge>
                  </span>
                )}
              </TableCell>
              <TableCell>{location.country}</TableCell>
              <TableCell className="text-center">
                <ArchivableTableRowActions
                  isArchived={location.isArchived}
                  deleteApiPath={`${apiEndpoints.deleteLocation}/${location.id}`}
                  restoreApiPath={`${apiEndpoints.restoreLocation}/${location.id}`}
                  deletionQuestion={`Видалити локацію ${formatLocationName(location)}? Якщо вона використовується в маршрутах, її буде перенесено до архіву.`}
                  deletionToastMessages={{
                    loading: "Видалення локації...",
                    success: "Локацію успішно видалено!",
                    error: "Не вдалося видалити локацію",
                  }}
                  archivedInsteadOfDeletedMessage="Локація використовується в маршрутах, тому її перенесено до архіву."
                  restoreToastMessages={{
                    loading: "Відновлення локації...",
                    success: "Локацію відновлено з архіву!",
                    error: "Не вдалося відновити локацію",
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
