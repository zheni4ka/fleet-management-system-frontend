import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import {
  reportDriverSummariesTableColumns,
  reportRoutesTableColumns,
  routeStatusLabels,
} from "@/lib/constants"
import {
  formatIsoDateOnly,
  formatDateTime,
  formatDriverFullName,
  formatHours,
  formatRouteDestinationLocationName,
  formatRouteDriverFullName,
  formatRouteStartLocationName,
} from "@/lib/formatters"
import { RoutesPeriodReport } from "@/lib/types"

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
}

export function RoutesPeriodReportView({
  routesPeriodReport,
}: RoutesPeriodReportViewProps) {
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
                    {formatDriverFullName({
                      name: driverSummary.driverName,
                      surname: driverSummary.driverSurname,
                    })}
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
                    {formatRouteStartLocationName(route)} →{" "}
                    {formatRouteDestinationLocationName(route)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatDateTime(route.departureTime)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatDateTime(route.arrivalTime)}
                  </TableCell>
                  <TableCell>{formatRouteDriverFullName(route)}</TableCell>
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
