import { z } from "zod"

export const autoMaintenanceSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  serviceDate: z.string(),
  plannedEndDate: z.string().nullable(),
  autoId: z.number().int(),
  isCompleted: z.boolean(),
  rowVersion: z.base64().min(1),
})
