import { z } from "zod"

export const dispatcherSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().nullable(),
  isDeactivated: z.boolean(),
  depotIds: z.array(z.number().int()),
})
