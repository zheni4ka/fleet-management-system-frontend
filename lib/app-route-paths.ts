import { appRoutes } from "@/lib/constants"

export function createDriverProfilePath(driverId: number): string {
  return `${appRoutes.drivers}/${driverId}`
}
