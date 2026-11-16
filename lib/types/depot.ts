import { z } from "zod"
import { depotSchema } from "@/lib/schemas/depot-schema"

export type Depot = z.infer<typeof depotSchema>
