import { z } from "zod"
import { driverLookupOptionSchema } from "@/lib/schemas/driver-lookup-option-schema"

export type DriverLookupOption = z.infer<typeof driverLookupOptionSchema>
