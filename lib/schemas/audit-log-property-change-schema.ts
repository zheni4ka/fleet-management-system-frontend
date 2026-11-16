import { z } from "zod"

export const auditLogPropertyChangeSchema = z.object({
  propertyName: z.string(),
  previousValue: z.string().nullable(),
  currentValue: z.string().nullable(),
})
