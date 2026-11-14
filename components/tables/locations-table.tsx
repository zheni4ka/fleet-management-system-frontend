"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { TableRowActionButton } from "@/components/tables/table-row-action-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { formatLocationName } from "@/lib/formatters"
import { hasActiveListFilters } from "@/lib/search-params"
import {
  apiEndpoints,
  locationsTableColumns,
  nothingFoundMessage,
  tableRowActionLabels,
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
  const [locationPendingDeletion, setLocationPendingDeletion] =
    useState<Location | null>(null)

  const handleDeleteConfirm = async () => {
    if (locationPendingDeletion === null) {
      return
    }
    const isLocationDeleted = await runApiMutation(
      () =>
        sendApiRequest(
          `${apiEndpoints.locations}/${locationPendingDeletion.id}`,
          HttpMethod.Delete
        ),
      {
        loading: "Видалення локації...",
        success: "Локацію успішно видалено!",
        error: "Не вдалося видалити локацію",
      }
    )
    if (isLocationDeleted) {
      setLocationPendingDeletion(null)
    }
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
                <TableRowActionButton
                  icon={Trash2}
                  label={tableRowActionLabels.delete}
                  variant="destructive"
                  className="text-red-700 hover:text-red-800"
                  onClick={() => setLocationPendingDeletion(location)}
                  disabled={isApiMutationRunning}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteConfirmationDialog
        deletionQuestion={
          locationPendingDeletion === null
            ? null
            : `Видалити локацію ${formatLocationName(locationPendingDeletion)}?`
        }
        isDeleting={isApiMutationRunning}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setLocationPendingDeletion(null)}
      />
    </div>
  )
}

export default LocationsTable
