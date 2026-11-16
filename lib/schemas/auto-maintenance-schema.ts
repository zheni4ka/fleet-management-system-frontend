import { z } from "zod"

export const autoMaintenanceSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  serviceDate: z.string(),
  autoId: z.number().int(),
  isCompleted: z.boolean(),
})
