import { useLocale, useTranslations } from "next-intl"
import { resolveAppLocale } from "@/lib/app-locale"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { formatUtcDateTimeWithTimeZone } from "@/lib/zoned-date-time"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import {
  reportDriverSummariesTableColumns,
  reportRoutesTableColumns,
} from "@/lib/constants"
import {
  formatIsoDateOnly,
  formatDriverFullName,
  formatHours,
  formatRouteDestinationLocationName,
  formatRouteDriverFullName,
  formatRouteStartLocationName,
} from "@/lib/formatters"
import { RouteStatus, RoutesPeriodReport } from "@/lib/types"

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
  const appLocale = resolveAppLocale(useLocale())
  const routeStatusTranslations = useTranslations("routeStatus")
  const reportTranslations = useTranslations("reports")
  const reportStatCards = [
    {
      label: reportTranslations("totalRoutesLabel"),
      value: String(routesPeriodReport.totalRoutesCount),
    },
    {
      label: routeStatusTranslations(RouteStatus.Planned),
      value: String(routesPeriodReport.plannedRoutesCount),
    },
    {
      label: routeStatusTranslations(RouteStatus.InProgress),
      value: String(routesPeriodReport.inProgressRoutesCount),
    },
    {
      label: routeStatusTranslations(RouteStatus.Completed),
      value: String(routesPeriodReport.completedRoutesCount),
    },
    {
      label: routeStatusTranslations(RouteStatus.Cancelled),
      value: String(routesPeriodReport.cancelledRoutesCount),
    },
    {
      label: reportTranslations("completedDrivingHoursLabel"),
      value: formatHours(
        routesPeriodReport.completedRoutesDrivingHours,
        appLocale
      ),
    },
    {
      label: reportTranslations("involvedAutosLabel"),
      value: String(routesPeriodReport.involvedAutosCount),
    },
    {
      label: reportTranslations("involvedDriversLabel"),
      value: String(routesPeriodReport.involvedDriversCount),
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">
        {reportTranslations("periodTitle", {
          periodStartDate: formatIsoDateOnly(
            routesPeriodReport.periodStartDate,
            appLocale
          ),
          periodEndDate: formatIsoDateOnly(
            routesPeriodReport.periodEndDate,
            appLocale
          ),
        })}
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
        <h3 className="font-semibold text-slate-700">
          {reportTranslations("driverLoadTitle")}
        </h3>
        <div className="overflow-hidden rounded-md border bg-white">
          <Table>
            <TableColumnsHeader
              tableColumns={reportDriverSummariesTableColumns}
            />
            <TableBody>
              {routesPeriodReport.driverSummaries.length === 0 && (
                <EmptyTableRow
                  columnCount={reportDriverSummariesTableColumns.length}
                  message={reportTranslations("noRoutesInPeriod")}
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
                    {formatHours(
                      driverSummary.completedRoutesDrivingHours,
                      appLocale
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold text-slate-700">
          {reportTranslations("routesTitle")}
        </h3>
        <div className="overflow-hidden rounded-md border bg-white">
          <Table>
            <TableColumnsHeader tableColumns={reportRoutesTableColumns} />
            <TableBody>
              {routesPeriodReport.routes.length === 0 && (
                <EmptyTableRow
                  columnCount={reportRoutesTableColumns.length}
                  message={reportTranslations("noRoutesInPeriod")}
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
                    {formatUtcDateTimeWithTimeZone(
                      route.departureTimeUtc,
                      route.startLocationTimeZoneId,
                      appLocale
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatUtcDateTimeWithTimeZone(
                      route.arrivalTimeUtc,
                      route.destinationLocationTimeZoneId,
                      appLocale
                    )}
                  </TableCell>
                  <TableCell>{formatRouteDriverFullName(route)}</TableCell>
                  <TableCell className="text-right">
                    {routeStatusTranslations(route.status)}
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
