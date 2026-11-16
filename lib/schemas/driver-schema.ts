import { z } from "zod"

export const driverSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  surname: z.string(),
  patronymic: z.string(),
  licenseNumber: z.string(),
})
