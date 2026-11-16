import { z } from "zod"

export const changePasswordRequestSchema = z.object({
  username: z.string().trim().min(1),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
})
