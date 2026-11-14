"use client"

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import EditDriverModal from "@/components/edit/edit-driver-modal"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import {
  apiEndpoints,
  driversTableColumns,
  nothingFoundMessage,
} from "@/lib/constants"
import { Driver, DriverSortField, HttpMethod, ListPageState } from "@/lib/types"

interface DriversTableProps {
  drivers: Driver[]
  listPageState: ListPageState<DriverSortField>
}

export function DriversTable({ drivers, listPageState }: DriversTableProps) {
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const handleDelete = async (driverId: number) => {
    if (!window.confirm("Ви впевнені, що хочете видалити водія?")) {
      return
    }
    await runApiMutation(
      () =>
        sendApiRequest(
          `${apiEndpoints.drivers}/${driverId}`,
          HttpMethod.Delete
        ),
      {
        loading: "Видалення водія...",
        success: "Водія успішно видалено!",
        error: "Не вдалося видалити водія",
      }
    )
  }

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
                listPageState.listQuery.search === ""
                  ? "Водіїв поки немає в системі."
                  : nothingFoundMessage
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
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                  {driver.licenseNumber}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <EditDriverModal driver={driver} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(driver.id)}
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

export default DriversTable
