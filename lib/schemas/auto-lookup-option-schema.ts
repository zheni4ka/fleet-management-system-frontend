import { z } from "zod"
import { AutoStatus } from "@/lib/types/auto-status"

export const autoLookupOptionSchema = z.object({
  id: z.number().int(),
  mark: z.string(),
  model: z.string(),
  number: z.string(),
  status: z.enum(AutoStatus),
})
