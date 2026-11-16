import { z } from "zod"
import { routeSchema } from "@/lib/schemas/route-schema"
import { routesPeriodReportDriverSummarySchema } from "@/lib/schemas/routes-period-report-driver-summary-schema"

export const routesPeriodReportSchema = z.object({
  periodStartDate: z.string(),
  periodEndDate: z.string(),
  totalRoutesCount: z.number().int(),
  plannedRoutesCount: z.number().int(),
  inProgressRoutesCount: z.number().int(),
  completedRoutesCount: z.number().int(),
  cancelledRoutesCount: z.number().int(),
  completedRoutesDrivingHours: z.number(),
  involvedAutosCount: z.number().int(),
  involvedDriversCount: z.number().int(),
  driverSummaries: z.array(routesPeriodReportDriverSummarySchema),
  routes: z.array(routeSchema),
})
