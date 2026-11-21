import { RouteAddressSelection } from "./route-address-selection"
import { RouteCitySelection } from "./route-city-selection"

export interface RouteAssignmentFormValues {
  startCity: RouteCitySelection | null
  startAddress: RouteAddressSelection | null
  destinationCity: RouteCitySelection | null
  destinationAddress: RouteAddressSelection | null
  autoId: string
  driverId: string
}
