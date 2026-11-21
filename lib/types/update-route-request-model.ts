import { RouteStatus } from "./route-status"

export interface UpdateRouteRequestModel {
  id: number
  rowVersion: string
  startLocationId: number
  destinationLocationId: number
  autoId: number
  driverId: number
  departureTimeUtc: string | null
  arrivalTimeUtc: string | null
  status: RouteStatus
}
