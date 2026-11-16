import { RouteStatus } from "./route-status"

export interface UpdateRouteRequestModel {
  id: number
  startLocationId: number
  destinationLocationId: number
  autoId: number
  driverId: number
  status: RouteStatus
}
