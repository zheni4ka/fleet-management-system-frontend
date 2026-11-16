import { z } from "zod"
import { autoLookupOptionSchema } from "@/lib/schemas/auto-lookup-option-schema"

export type AutoLookupOption = z.infer<typeof autoLookupOptionSchema>
