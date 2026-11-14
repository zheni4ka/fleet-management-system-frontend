import { RouteStatus } from "./route-status"

export interface EditRouteFormValues {
  startLocationId: string
  destinationLocationId: string
  autoId: string
  driverId: string
  status: RouteStatus
}
