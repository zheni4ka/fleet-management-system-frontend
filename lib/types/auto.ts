import { z } from "zod"
import { autoSchema } from "@/lib/schemas/auto-schema"

export type Auto = z.infer<typeof autoSchema>
