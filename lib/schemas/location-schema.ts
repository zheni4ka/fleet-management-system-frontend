import { z } from "zod"

export const locationSchema = z.object({
  id: z.number().int(),
  city: z.string(),
  country: z.string(),
  timeZoneId: z.string().min(1),
  geoNamesId: z.number().int().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  isArchived: z.boolean(),
})
