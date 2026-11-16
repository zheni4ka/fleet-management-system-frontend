import { z } from "zod"

export const locationSchema = z.object({
  id: z.number().int(),
  city: z.string(),
  country: z.string(),
})
