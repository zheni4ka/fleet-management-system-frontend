import { useLocale, useTranslations } from "next-intl"
import { resolveAppLocale } from "@/lib/app-locale"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { formatUtcDateTimeInTimeZone } from "@/lib/zoned-date-time"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import {
  reportDriverSummariesTableColumns,
  reportRoutesTableColumns,
} from "@/lib/constants"
import {
  formatDateTime,
  formatIsoDateOnly,
  formatDriverFullName,
  formatHours,
  formatRouteDestinationLocationName,
  formatRouteDriverFullName,
  formatRouteStartLocationName,
} from "@/lib/formatters"
import { RouteStatus, RoutesPeriodReport } from "@/lib/types"
import { cn } from "@/lib/utils"

const reportTableClassName = "table-fixed text-sm print:text-[11px]"
const reportTableContainerClassName = "overflow-visible"
const reportTableCellClassName =
  "align-top break-words whitespace-normal print:py-1"
const reportTableRowClassName = "print:break-inside-avoid"

interface ReportStatRowProps {
  label: string
  value: string
}

function ReportStatRow({ label, value }: ReportStatRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 py-1.5">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-slate-900 tabular-nums">
        {value}
      </dd>
    </div>
  )
}

interface ZonedDateTimeCellContentProps {
  utcIsoDateTime: string
  timeZoneId: string
}

function ZonedDateTimeCellContent({
  utcIsoDateTime,
  timeZoneId,
}: ZonedDateTimeCellContentProps) {
  const appLocale = resolveAppLocale(useLocale())
  return (
    <>
      <span className="block">
        {formatUtcDateTimeInTimeZone(utcIsoDateTime, timeZoneId, appLocale)}
      </span>
      <span className="block text-[11px] text-slate-500 print:text-[9px]">
        {timeZoneId}
      </span>
    </>
  )
}

interface RoutesPeriodReportViewProps {
  routesPeriodReport: RoutesPeriodReport
  reportGeneratedAtUtc: string
}

export function RoutesPeriodReportView({
  routesPeriodReport,
  reportGeneratedAtUtc,
}: RoutesPeriodReportViewProps) {
  const appLocale = resolveAppLocale(useLocale())
  const routeStatusTranslations = useTranslations("routeStatus")
  const reportTranslations = useTranslations("reports")
  const reportStatRows = [
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
    <div className="space-y-6 print:space-y-4">
      <div className="space-y-1">
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
        <p className="hidden text-xs text-slate-500 print:block">
          {reportTranslations("generatedAtLabel", {
            generatedAt: formatDateTime(reportGeneratedAtUtc, appLocale),
          })}
        </p>
      </div>

      <dl className="grid gap-x-10 rounded-xl border bg-white px-4 py-2 sm:grid-cols-2 print:grid-cols-2 print:rounded-none print:border-x-0 print:px-0">
        {reportStatRows.map((reportStatRow) => (
          <ReportStatRow
            key={reportStatRow.label}
            label={reportStatRow.label}
            value={reportStatRow.value}
          />
        ))}
      </dl>

      <section className="space-y-2 print:break-inside-avoid">
        <h3 className="font-semibold text-slate-700">
          {reportTranslations("driverLoadTitle")}
        </h3>
        <div className="rounded-md border bg-white">
          <Table
            className={reportTableClassName}
            containerClassName={reportTableContainerClassName}
          >
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
                <TableRow
                  key={driverSummary.driverId}
                  className={reportTableRowClassName}
                >
                  <TableCell
                    className={cn(reportTableCellClassName, "font-medium")}
                  >
                    {formatDriverFullName({
                      name: driverSummary.driverName,
                      surname: driverSummary.driverSurname,
                    })}
                  </TableCell>
                  <TableCell
                    className={cn(reportTableCellClassName, "text-center")}
                  >
                    {driverSummary.routesCount}
                  </TableCell>
                  <TableCell
                    className={cn(reportTableCellClassName, "text-center")}
                  >
                    {driverSummary.completedRoutesCount}
                  </TableCell>
                  <TableCell
                    className={cn(reportTableCellClassName, "text-center")}
                  >
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
        <div className="rounded-md border bg-white">
          <Table
            className={reportTableClassName}
            containerClassName={reportTableContainerClassName}
          >
            <TableColumnsHeader tableColumns={reportRoutesTableColumns} />
            <TableBody>
              {routesPeriodReport.routes.length === 0 && (
                <EmptyTableRow
                  columnCount={reportRoutesTableColumns.length}
                  message={reportTranslations("noRoutesInPeriod")}
                />
              )}
              {routesPeriodReport.routes.map((route) => (
                <TableRow key={route.id} className={reportTableRowClassName}>
                  <TableCell
                    className={cn(
                      reportTableCellClassName,
                      "font-mono text-xs"
                    )}
                  >
                    {route.id}
                  </TableCell>
                  <TableCell
                    className={cn(reportTableCellClassName, "font-medium")}
                  >
                    {formatRouteStartLocationName(route)} →{" "}
                    {formatRouteDestinationLocationName(route)}
                  </TableCell>
                  <TableCell className={reportTableCellClassName}>
                    <ZonedDateTimeCellContent
                      utcIsoDateTime={route.departureTimeUtc}
                      timeZoneId={route.startLocationTimeZoneId}
                    />
                  </TableCell>
                  <TableCell className={reportTableCellClassName}>
                    <ZonedDateTimeCellContent
                      utcIsoDateTime={route.arrivalTimeUtc}
                      timeZoneId={route.destinationLocationTimeZoneId}
                    />
                  </TableCell>
                  <TableCell className={reportTableCellClassName}>
                    {formatRouteDriverFullName(route)}
                  </TableCell>
                  <TableCell className={reportTableCellClassName}>
                    {route.autoNumber}
                  </TableCell>
                  <TableCell className={reportTableCellClassName}>
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
