import Link from "next/link"
import { useTranslations } from "next-intl"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import EditDriverModal from "@/components/edit/edit-driver-modal"
import { ArchivableTableRowActions } from "@/components/tables/archivable-table-row-actions"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { createDriverProfilePath } from "@/lib/app-route-paths"
import {
  formatDriverFullName,
  formatDriverFullNameWithPatronymic,
} from "@/lib/formatters"
import { hasActiveListFilters } from "@/lib/search-params"
import { apiEndpoints, driversTableColumns } from "@/lib/constants"
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
  const listFilterTranslations = useTranslations("listFilters")
  const driverTranslations = useTranslations("drivers")
  const commonTranslations = useTranslations("common")
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
                  ? commonTranslations("nothingFoundMessage")
                  : driverTranslations("emptyList")
              }
            />
          )}
          {drivers.map((driver) => (
            <TableRow key={driver.id} className="hover:bg-slate-50/50">
              <TableCell className="font-mono text-xs">{driver.id}</TableCell>
              <TableCell className="font-medium whitespace-normal">
                <Link
                  href={createDriverProfilePath(driver.id)}
                  className="text-indigo-700 hover:underline"
                >
                  {formatDriverFullNameWithPatronymic(driver)}
                </Link>
              </TableCell>
              <TableCell>
                <Badge tone={BadgeTone.Info}>{driver.licenseNumber}</Badge>
                {driver.isArchived && (
                  <span className="ml-2">
                    <Badge tone={BadgeTone.Neutral}>
                      {listFilterTranslations("archivedBadgeLabel")}
                    </Badge>
                  </span>
                )}
              </TableCell>
              <TableCell className="text-sm whitespace-normal">
                {driver.phoneNumber === null && driver.email === null ? (
                  <span className="text-slate-400">
                    {driverTranslations("noContactsLabel")}
                  </span>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    {driver.phoneNumber !== null && (
                      <a
                        href={`tel:${driver.phoneNumber}`}
                        className="hover:underline"
                      >
                        {driver.phoneNumber}
                      </a>
                    )}
                    {driver.email !== null && (
                      <a
                        href={`mailto:${driver.email}`}
                        className="break-all text-slate-600 hover:underline"
                      >
                        {driver.email}
                      </a>
                    )}
                  </div>
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
                    deletionQuestion={driverTranslations("deletionQuestion", {
                      driverFullName: formatDriverFullName(driver),
                      licenseNumber: driver.licenseNumber,
                    })}
                    deletionToastMessages={{
                      loading: driverTranslations("deleteLoading"),
                      success: driverTranslations("deleteSuccess"),
                      error: driverTranslations("deleteError"),
                    }}
                    archivedInsteadOfDeletedMessage={driverTranslations(
                      "archivedInsteadOfDeleted"
                    )}
                    restoreToastMessages={{
                      loading: driverTranslations("restoreLoading"),
                      success: driverTranslations("restoreSuccess"),
                      error: driverTranslations("restoreError"),
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
