import { z } from "zod"

export const sessionResponseSchema = z.object({
  accessToken: z.string(),
  accessTokenExpiresAtUtc: z.iso.datetime({ offset: true }),
  refreshToken: z.string(),
  refreshTokenExpiresAtUtc: z.iso.datetime({ offset: true }),
  username: z.string(),
  email: z.string().nullable(),
  roles: z.array(z.string()),
})
