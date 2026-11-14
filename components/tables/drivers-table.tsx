"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import EditDriverModal from "@/components/edit/edit-driver-modal"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { formatDriverFullName } from "@/lib/formatters"
import { hasActiveListFilters } from "@/lib/search-params"
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
  const [driverPendingDeletion, setDriverPendingDeletion] =
    useState<Driver | null>(null)

  const handleDeleteConfirm = async () => {
    if (driverPendingDeletion === null) {
      return
    }
    const isDriverDeleted = await runApiMutation(
      () =>
        sendApiRequest(
          `${apiEndpoints.drivers}/${driverPendingDeletion.id}`,
          HttpMethod.Delete
        ),
      {
        loading: "Видалення водія...",
        success: "Водія успішно видалено!",
        error: "Не вдалося видалити водія",
      }
    )
    if (isDriverDeleted) {
      setDriverPendingDeletion(null)
    }
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
                hasActiveListFilters(listPageState)
                  ? nothingFoundMessage
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
                    className="text-red-700 hover:text-red-800"
                    onClick={() => setDriverPendingDeletion(driver)}
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
      <DeleteConfirmationDialog
        deletionQuestion={
          driverPendingDeletion === null
            ? null
            : `Видалити водія ${formatDriverFullName(driverPendingDeletion)} (${driverPendingDeletion.licenseNumber})?`
        }
        isDeleting={isApiMutationRunning}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDriverPendingDeletion(null)}
      />
    </div>
  )
}

export default DriversTable
