import { z } from "zod"
import { RouteStatus } from "@/lib/types/route-status"

export const driverTripSchema = z.object({
  id: z.number().int(),
  driverId: z.number().int(),
  routeId: z.number().int().nullable(),
  autoId: z.number().int(),
  autoMark: z.string(),
  autoModel: z.string(),
  autoNumber: z.string(),
  startLocationCity: z.string(),
  startLocationCountry: z.string(),
  startLocationTimeZoneId: z.string().min(1),
  destinationLocationCity: z.string(),
  destinationLocationCountry: z.string(),
  destinationLocationTimeZoneId: z.string().min(1),
  plannedDepartureTimeUtc: z.iso.datetime(),
  plannedArrivalTimeUtc: z.iso.datetime(),
  startedAtUtc: z.iso.datetime(),
  endedAtUtc: z.iso.datetime(),
  drivingMinutes: z.number().int().nonnegative(),
  finalStatus: z.enum(RouteStatus),
})
