import { z } from "zod"

export const routesPeriodReportDriverSummarySchema = z.object({
  driverId: z.number().int(),
  driverName: z.string(),
  driverSurname: z.string(),
  routesCount: z.number().int(),
  completedRoutesCount: z.number().int(),
  completedRoutesDrivingHours: z.number(),
})
