import { z } from "zod"

export const driverTripSummarySchema = z.object({
  driverId: z.number().int(),
  tripsCount: z.number().int().nonnegative(),
  completedTripsCount: z.number().int().nonnegative(),
  cancelledTripsCount: z.number().int().nonnegative(),
  drivingMinutes: z.number().int().nonnegative(),
  lastTripEndedAtUtc: z.iso.datetime().nullable(),
})
