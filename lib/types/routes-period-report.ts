import { z } from "zod"
import { routesPeriodReportSchema } from "@/lib/schemas/routes-period-report-schema"

export type RoutesPeriodReport = z.infer<typeof routesPeriodReportSchema>
