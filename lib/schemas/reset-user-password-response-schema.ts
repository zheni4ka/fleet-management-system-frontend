import { z } from "zod"

export const resetUserPasswordResponseSchema = z.object({
  temporaryPassword: z.string().min(1),
})
