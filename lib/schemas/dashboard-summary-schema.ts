import { z } from "zod"

export const dashboardSummarySchema = z.object({
  autosCount: z.number().int(),
  driversCount: z.number().int(),
  routesCount: z.number().int(),
  activeRoutesCount: z.number().int(),
})
