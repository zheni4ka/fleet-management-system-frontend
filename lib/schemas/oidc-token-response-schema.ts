import { z } from "zod"

export const oidcTokenResponseSchema = z.object({
  id_token: z.string().min(1),
})
