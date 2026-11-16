import { z } from "zod"

export const locationSchema = z.object({
  id: z.number().int(),
  city: z.string(),
  country: z.string(),
  timeZoneId: z.string().min(1),
  isArchived: z.boolean(),
})
