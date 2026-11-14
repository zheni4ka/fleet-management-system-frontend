import { RouteStatus } from "./route-status"

export interface Route {
  id: number
  startLocationId: number
  destinationLocationId: number
  departureTime: string
  arrivalTime: string
  autoId: number
  driverId: number
  status: RouteStatus
}
