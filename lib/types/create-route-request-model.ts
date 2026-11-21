import { RouteAddressRequestFields } from "./route-address-request-fields"
import { RouteStatus } from "./route-status"

export interface CreateRouteRequestModel extends RouteAddressRequestFields {
  startLocationId: number
  destinationLocationId: number
  departureTimeUtc: string
  arrivalTimeUtc: string
  autoId: number
  driverId: number
  status: RouteStatus
}
