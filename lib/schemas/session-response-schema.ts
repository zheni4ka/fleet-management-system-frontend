import { z } from "zod"
import { AppLocale } from "@/lib/types/app-locale"

export const sessionResponseSchema = z.object({
  accessToken: z.string(),
  accessTokenExpiresAtUtc: z.iso.datetime({ offset: true }),
  refreshToken: z.string(),
  refreshTokenExpiresAtUtc: z.iso.datetime({ offset: true }),
  username: z.string(),
  email: z.string().nullable(),
  roles: z.array(z.string()),
  preferredLanguage: z.enum(AppLocale),
})
