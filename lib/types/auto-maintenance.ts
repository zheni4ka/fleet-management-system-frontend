import { z } from "zod"
import { autoMaintenanceSchema } from "@/lib/schemas/auto-maintenance-schema"

export type AutoMaintenance = z.infer<typeof autoMaintenanceSchema>
