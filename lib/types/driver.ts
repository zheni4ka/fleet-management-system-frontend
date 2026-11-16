import { z } from "zod"
import { driverSchema } from "@/lib/schemas/driver-schema"

export type Driver = z.infer<typeof driverSchema>
