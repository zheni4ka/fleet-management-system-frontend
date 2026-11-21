import { useLocale, useTranslations } from "next-intl"
import { resolveAppLocale } from "@/lib/app-locale"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { RouteStatusBadge } from "@/components/route-status-badge"
import { driverTripsTableColumns } from "@/lib/constants"
import {
  formatAutoTitleWithNumber,
  formatDrivingMinutes,
  formatLocationName,
} from "@/lib/formatters"
import { formatUtcDateTimeInTimeZone } from "@/lib/zoned-date-time"
import { DriverTrip, DriverTripSortField, ListPageState } from "@/lib/types"

const driverTripCellClassName = "align-top break-words whitespace-normal"

interface DriverTripsTableProps {
  driverTrips: ReadonlyArray<DriverTrip>
  listPageState: ListPageState<DriverTripSortField>
}

export function DriverTripsTable({
  driverTrips,
  listPageState,
}: DriverTripsTableProps) {
  const appLocale = resolveAppLocale(useLocale())
  const driverProfileTranslations = useTranslations("driverProfile")

  return (
    <div className="rounded-md border bg-white">
      <Table className="table-fixed" containerClassName="overflow-visible">
        <TableColumnsHeader
          tableColumns={driverTripsTableColumns}
          listPageState={listPageState}
        />
        <TableBody>
          {driverTrips.length === 0 && (
            <EmptyTableRow
              columnCount={driverTripsTableColumns.length}
              message={driverProfileTranslations("noTrips")}
            />
          )}
          {driverTrips.map((driverTrip) => (
            <TableRow key={driverTrip.id}>
              <TableCell className={driverTripCellClassName}>
                <span className="block">
                  {formatUtcDateTimeInTimeZone(
                    driverTrip.startedAtUtc,
                    driverTrip.startLocationTimeZoneId,
                    appLocale
                  )}
                </span>
                <span className="block text-[11px] text-slate-500">
                  {driverTrip.startLocationTimeZoneId}
                </span>
              </TableCell>
              <TableCell className={driverTripCellClassName}>
                <span className="font-medium">
                  {formatLocationName({
                    city: driverTrip.startLocationCity,
                    country: driverTrip.startLocationCountry,
                  })}{" "}
                  →{" "}
                  {formatLocationName({
                    city: driverTrip.destinationLocationCity,
                    country: driverTrip.destinationLocationCountry,
                  })}
                </span>
                {driverTrip.routeId === null ? (
                  <span className="block text-[11px] text-slate-500">
                    {driverProfileTranslations("routeDeletedLabel")}
                  </span>
                ) : (
                  <span className="block font-mono text-[11px] text-slate-500">
                    #{driverTrip.routeId}
                  </span>
                )}
              </TableCell>
              <TableCell className={driverTripCellClassName}>
                {formatAutoTitleWithNumber({
                  mark: driverTrip.autoMark,
                  model: driverTrip.autoModel,
                  number: driverTrip.autoNumber,
                })}
              </TableCell>
              <TableCell className={driverTripCellClassName}>
                <span className="block">
                  {formatUtcDateTimeInTimeZone(
                    driverTrip.endedAtUtc,
                    driverTrip.destinationLocationTimeZoneId,
                    appLocale
                  )}
                </span>
                <span className="block text-[11px] text-slate-500">
                  {driverTrip.destinationLocationTimeZoneId}
                </span>
              </TableCell>
              <TableCell className={driverTripCellClassName}>
                {formatDrivingMinutes(driverTrip.drivingMinutes, appLocale)}
              </TableCell>
              <TableCell className={driverTripCellClassName}>
                <RouteStatusBadge routeStatus={driverTrip.finalStatus} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
