import { RouteStatus } from "./route-status"

export interface CreateRouteRequestModel {
  startLocationId: number
  destinationLocationId: number
  departureTimeUtc: string
  arrivalTimeUtc: string
  autoId: number
  driverId: number
  status: RouteStatus
}
