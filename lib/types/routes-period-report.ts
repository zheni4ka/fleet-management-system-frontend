import { Route } from "./route"
import { RoutesPeriodReportDriverSummary } from "./routes-period-report-driver-summary"

export interface RoutesPeriodReport {
  periodStartDate: string
  periodEndDate: string
  totalRoutesCount: number
  plannedRoutesCount: number
  inProgressRoutesCount: number
  completedRoutesCount: number
  cancelledRoutesCount: number
  completedRoutesDrivingHours: number
  involvedAutosCount: number
  involvedDriversCount: number
  driverSummaries: RoutesPeriodReportDriverSummary[]
  routes: Route[]
}
