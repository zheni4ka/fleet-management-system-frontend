import { z } from "zod"
import { dispatcherSchema } from "@/lib/schemas/dispatcher-schema"

export type Dispatcher = z.infer<typeof dispatcherSchema>
