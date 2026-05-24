export interface Driver {
  id: number
  name: string
  surname: string
  patronymic: string
  licenseNumber: string

}

export interface Auto {
    id: number
    mark: string
    model: string
    color: string
    number: string
    capacity: number

}

export interface Route {
    id: number
    start: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    autoId: number;
    driverId: number;
}


export interface RouteCardProps {
    start: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    autoId?: number;
    driverId?: number;
    autoName?: string;
    driverName?: string;
}
