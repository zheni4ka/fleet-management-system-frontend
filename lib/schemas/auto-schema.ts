import { z } from "zod"
import { AutoStatus } from "@/lib/types/auto-status"

export const autoSchema = z.object({
  id: z.number().int(),
  mark: z.string(),
  model: z.string(),
  color: z.string(),
  number: z.string(),
  capacity: z.number(),
  status: z.enum(AutoStatus),
  depotId: z.number().int(),
  depotName: z.string(),
  isArchived: z.boolean(),
  rowVersion: z.base64().min(1),
})
