import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import EditDriverModal from "@/components/edit/edit-driver-modal"
import { ArchivableTableRowActions } from "@/components/tables/archivable-table-row-actions"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { formatDriverFullName } from "@/lib/formatters"
import { hasActiveListFilters } from "@/lib/search-params"
import {
  apiEndpoints,
  commonUiTexts,
  driversTableColumns,
  listFilterTexts,
} from "@/lib/constants"
import {
  BadgeTone,
  Depot,
  Driver,
  DriverSortField,
  ListPageState,
} from "@/lib/types"

interface DriversTableProps {
  drivers: Driver[]
  depots: ReadonlyArray<Depot>
  listPageState: ListPageState<DriverSortField>
}

export function DriversTable({
  drivers,
  depots,
  listPageState,
}: DriversTableProps) {
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
                {driver.isArchived && (
                  <span className="ml-2">
                    <Badge tone={BadgeTone.Neutral}>
                      {listFilterTexts.archivedBadgeLabel}
                    </Badge>
                  </span>
                )}
              </TableCell>
              <TableCell>{driver.depotName}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  {!driver.isArchived && (
                    <EditDriverModal driver={driver} depots={depots} />
                  )}
                  <ArchivableTableRowActions
                    isArchived={driver.isArchived}
                    deleteApiPath={`${apiEndpoints.deleteDriver}/${driver.id}`}
                    restoreApiPath={`${apiEndpoints.restoreDriver}/${driver.id}`}
                    deletionQuestion={`Видалити водія ${formatDriverFullName(driver)} (${driver.licenseNumber})? Якщо його призначено на маршрути, його буде перенесено до архіву.`}
                    deletionToastMessages={{
                      loading: "Видалення водія...",
                      success: "Водія успішно видалено!",
                      error: "Не вдалося видалити водія",
                    }}
                    archivedInsteadOfDeletedMessage="Водія призначено на маршрути, тому його перенесено до архіву."
                    restoreToastMessages={{
                      loading: "Відновлення водія...",
                      success: "Водія відновлено з архіву!",
                      error: "Не вдалося відновити водія",
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
