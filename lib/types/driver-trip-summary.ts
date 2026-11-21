import { z } from "zod"
import { driverTripSummarySchema } from "@/lib/schemas/driver-trip-summary-schema"

export type DriverTripSummary = z.infer<typeof driverTripSummarySchema>
