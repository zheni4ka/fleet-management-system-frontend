import { z } from "zod"

export const dispatcherSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().nullable(),
})
