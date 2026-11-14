"use client"

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { hasActiveListFilters } from "@/lib/search-params"
import {
  apiEndpoints,
  locationsTableColumns,
  nothingFoundMessage,
} from "@/lib/constants"
import {
  HttpMethod,
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
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const handleDelete = async (locationId: number) => {
    if (!window.confirm("Ви впевнені, що хочете видалити локацію?")) {
      return
    }
    await runApiMutation(
      () =>
        sendApiRequest(
          `${apiEndpoints.locations}/${locationId}`,
          HttpMethod.Delete
        ),
      {
        loading: "Видалення локації...",
        success: "Локацію успішно видалено!",
        error: "Не вдалося видалити локацію",
      }
    )
  }

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
                  ? nothingFoundMessage
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
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(location.id)}
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

export default LocationsTable
