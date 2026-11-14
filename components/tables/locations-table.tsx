"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints, locationsTableColumns } from "@/lib/constants"
import { HttpMethod, Location } from "@/lib/types"
import { isMatchingSearchQuery } from "@/lib/utils"

interface LocationsTableProps {
  locations: Location[]
}

export function LocationsTable({ locations }: LocationsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const filteredLocations = locations.filter((location) =>
    isMatchingSearchQuery(searchQuery, [location.city, location.country])
  )

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
    <div className="space-y-4">
      <Input
        placeholder="Пошук локації (місто, країна)..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="max-w-sm bg-white shadow-sm"
      />

      <div className="overflow-hidden rounded-md border bg-white">
        <Table>
          <TableColumnsHeader tableColumns={locationsTableColumns} />
          <TableBody>
            {filteredLocations.length === 0 && (
              <EmptyTableRow
                columnCount={locationsTableColumns.length}
                message={
                  locations.length === 0
                    ? "Локацій поки немає в системі."
                    : "Нічого не знайдено за вашим запитом."
                }
              />
            )}
            {filteredLocations.map((location) => (
              <TableRow key={location.id} className="hover:bg-slate-50/50">
                <TableCell className="font-mono text-xs">
                  {location.id}
                </TableCell>
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
    </div>
  )
}

export default LocationsTable
