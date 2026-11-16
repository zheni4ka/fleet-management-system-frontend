import { z } from "zod"
import { dashboardSummarySchema } from "@/lib/schemas/dashboard-summary-schema"

export type DashboardSummary = z.infer<typeof dashboardSummarySchema>
