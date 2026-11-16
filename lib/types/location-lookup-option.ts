import { z } from "zod"
import { locationLookupOptionSchema } from "@/lib/schemas/location-lookup-option-schema"

export type LocationLookupOption = z.infer<typeof locationLookupOptionSchema>
