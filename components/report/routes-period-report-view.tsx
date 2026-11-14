import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import {
  reportDriverSummariesTableColumns,
  reportRoutesTableColumns,
  routeStatusLabels,
  unknownLocationLabel,
} from "@/lib/constants"
import {
  formatIsoDateOnly,
  formatDateTime,
  formatDriverFullName,
  formatHours,
  formatLocationName,
} from "@/lib/formatters"
import { Driver, Location, RoutesPeriodReport } from "@/lib/types"

interface ReportStatCardProps {
  label: string
  value: string
}

function ReportStatCard({ label, value }: ReportStatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

interface RoutesPeriodReportViewProps {
  routesPeriodReport: RoutesPeriodReport
  drivers: Driver[]
  locations: Location[]
}

export function RoutesPeriodReportView({
  routesPeriodReport,
  drivers,
  locations,
}: RoutesPeriodReportViewProps) {
  const driversById = new Map(drivers.map((driver) => [driver.id, driver]))
  const locationsById = new Map(
    locations.map((location) => [location.id, location])
  )

  const getDriverFullName = (driverId: number): string => {
    const driver = driversById.get(driverId)
    return driver === undefined
      ? `Водій ID: ${driverId}`
      : formatDriverFullName(driver)
  }

  const getLocationName = (locationId: number): string => {
    const location = locationsById.get(locationId)
    return location === undefined
      ? unknownLocationLabel
      : formatLocationName(location)
  }

  const reportStatCards = [
    {
      label: "Усього рейсів",
      value: String(routesPeriodReport.totalRoutesCount),
    },
    {
      label: "Заплановано",
      value: String(routesPeriodReport.plannedRoutesCount),
    },
    {
      label: "В процесі",
      value: String(routesPeriodReport.inProgressRoutesCount),
    },
    {
      label: "Виконано",
      value: String(routesPeriodReport.completedRoutesCount),
    },
    {
      label: "Скасовано",
      value: String(routesPeriodReport.cancelledRoutesCount),
    },
    {
      label: "Годин у дорозі (виконані)",
      value: formatHours(routesPeriodReport.completedRoutesDrivingHours),
    },
    {
      label: "Задіяно автомобілів",
      value: String(routesPeriodReport.involvedAutosCount),
    },
    {
      label: "Задіяно водіїв",
      value: String(routesPeriodReport.involvedDriversCount),
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">
        Звіт за період {formatIsoDateOnly(routesPeriodReport.periodStartDate)} —{" "}
        {formatIsoDateOnly(routesPeriodReport.periodEndDate)}
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {reportStatCards.map((reportStatCard) => (
          <ReportStatCard
            key={reportStatCard.label}
            label={reportStatCard.label}
            value={reportStatCard.value}
          />
        ))}
      </div>

      <section className="space-y-2">
        <h3 className="font-semibold text-slate-700">Навантаження водіїв</h3>
        <div className="overflow-hidden rounded-md border bg-white">
          <Table>
            <TableColumnsHeader
              tableColumns={reportDriverSummariesTableColumns}
            />
            <TableBody>
              {routesPeriodReport.driverSummaries.length === 0 && (
                <EmptyTableRow
                  columnCount={reportDriverSummariesTableColumns.length}
                  message="За обраний період рейсів немає."
                />
              )}
              {routesPeriodReport.driverSummaries.map((driverSummary) => (
                <TableRow key={driverSummary.driverId}>
                  <TableCell className="font-medium">
                    {getDriverFullName(driverSummary.driverId)}
                  </TableCell>
                  <TableCell className="text-center">
                    {driverSummary.routesCount}
                  </TableCell>
                  <TableCell className="text-center">
                    {driverSummary.completedRoutesCount}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatHours(driverSummary.completedRoutesDrivingHours)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold text-slate-700">Рейси за період</h3>
        <div className="overflow-hidden rounded-md border bg-white">
          <Table>
            <TableColumnsHeader tableColumns={reportRoutesTableColumns} />
            <TableBody>
              {routesPeriodReport.routes.length === 0 && (
                <EmptyTableRow
                  columnCount={reportRoutesTableColumns.length}
                  message="За обраний період рейсів немає."
                />
              )}
              {routesPeriodReport.routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-mono text-xs">
                    {route.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {getLocationName(route.startLocationId)} →{" "}
                    {getLocationName(route.destinationLocationId)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatDateTime(route.departureTime)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatDateTime(route.arrivalTime)}
                  </TableCell>
                  <TableCell>{getDriverFullName(route.driverId)}</TableCell>
                  <TableCell className="text-right">
                    {routeStatusLabels[route.status]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}

export default RoutesPeriodReportView
