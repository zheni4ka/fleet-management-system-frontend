import { z } from "zod"
import { routesPeriodReportDriverSummarySchema } from "@/lib/schemas/routes-period-report-driver-summary-schema"

export type RoutesPeriodReportDriverSummary = z.infer<
  typeof routesPeriodReportDriverSummarySchema
>
