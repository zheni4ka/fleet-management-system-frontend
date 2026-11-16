import { z } from "zod"

export const driverLookupOptionSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  surname: z.string(),
  licenseNumber: z.string(),
})
