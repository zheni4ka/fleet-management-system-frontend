import { z } from "zod"
import { driverTripSchema } from "@/lib/schemas/driver-trip-schema"

export type DriverTrip = z.infer<typeof driverTripSchema>
