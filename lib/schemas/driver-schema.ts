import { z } from "zod"

export const driverSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  surname: z.string(),
  patronymic: z.string(),
  licenseNumber: z.string(),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
  depotId: z.number().int(),
  depotName: z.string(),
  isArchived: z.boolean(),
  rowVersion: z.base64().min(1),
})
