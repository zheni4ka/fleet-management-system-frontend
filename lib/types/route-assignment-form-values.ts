import { RouteCitySelection } from "./route-city-selection"

export interface RouteAssignmentFormValues {
  startCity: RouteCitySelection | null
  destinationCity: RouteCitySelection | null
  autoId: string
  driverId: string
}
