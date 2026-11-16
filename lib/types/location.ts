import { z } from "zod"
import { locationSchema } from "@/lib/schemas/location-schema"

export type Location = z.infer<typeof locationSchema>
