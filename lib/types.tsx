export interface Driver {
  id: number
  name: string
  surname: string
  patronymic: string
  licenseNumber: string
}

export type AutoStatus =
  | "Available"
  | "InService"
  | "UnderMaintenance";

export interface Auto {
  id: number
  mark: string
  model: string
  color: string
  number: string
  capacity: number
  status: AutoStatus
}

export interface EditAutoForm {
    mark: string
    model: string
    color: string
    licensePlate: string
    capacity: number
    status: string
}

export interface Location {
  id: number
  city: string
  country: string
}

export type RouteStatus =
  | "Planned"
  | "InProgress"
  | "Completed"
  | "Cancelled";

export interface AutoMaintenance {
  id: number
  name: string
  description: string
  serviceDate: string
  autoId: number
}

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

export interface RouteCardProps {
  startLocationName?: string
  destinationLocationName?: string
  departureTime: string
  arrivalTime: string
  autoId?: number
  driverId?: number
  autoName?: string
  driverName?: string
  status?: RouteStatus
}

export interface DriversTableProps {
  data: Driver[]
}

