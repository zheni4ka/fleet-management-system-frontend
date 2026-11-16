import { z } from "zod"
import { routeSchema } from "@/lib/schemas/route-schema"

export type Route = z.infer<typeof routeSchema>
