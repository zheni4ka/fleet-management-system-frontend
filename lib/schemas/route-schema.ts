import { z } from "zod"
import { RouteStatus } from "@/lib/types/route-status"

export const routeSchema = z.object({
  id: z.number().int(),
  startLocationId: z.number().int(),
  startLocationCity: z.string(),
  startLocationCountry: z.string(),
  destinationLocationId: z.number().int(),
  destinationLocationCity: z.string(),
  destinationLocationCountry: z.string(),
  departureTime: z.string(),
  arrivalTime: z.string(),
  autoId: z.number().int(),
  autoMark: z.string(),
  autoModel: z.string(),
  autoNumber: z.string(),
  driverId: z.number().int(),
  driverName: z.string(),
  driverSurname: z.string(),
  status: z.enum(RouteStatus),
  depotId: z.number().int(),
  depotName: z.string(),
  rowVersion: z.base64().min(1),
})
