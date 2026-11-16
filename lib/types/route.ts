import { RouteStatus } from "./route-status"

export interface Route {
  id: number
  startLocationId: number
  startLocationCity: string
  startLocationCountry: string
  destinationLocationId: number
  destinationLocationCity: string
  destinationLocationCountry: string
  departureTime: string
  arrivalTime: string
  autoId: number
  autoMark: string
  autoModel: string
  autoNumber: string
  driverId: number
  driverName: string
  driverSurname: string
  status: RouteStatus
}
