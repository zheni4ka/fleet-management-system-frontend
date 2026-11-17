import { z } from "zod"
import { AppLocale } from "@/lib/types/app-locale"

export const updateLanguageRequestSchema = z.object({
  language: z.enum(AppLocale),
})
