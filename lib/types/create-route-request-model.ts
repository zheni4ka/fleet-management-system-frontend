import { RouteStatus } from "./route-status"

export interface CreateRouteRequestModel {
  startLocationId: number
  destinationLocationId: number
  departureTime: string
  arrivalTime: string
  autoId: number
  driverId: number
  status: RouteStatus
}
