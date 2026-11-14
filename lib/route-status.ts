import {
  activeRouteStatuses,
  allowedRouteStatusTransitions,
} from "@/lib/constants"
import { RouteStatus } from "@/lib/types"

export function isRouteStatusActive(routeStatus: RouteStatus): boolean {
  return activeRouteStatuses.includes(routeStatus)
}

export function canRouteStatusChangeTo(
  currentRouteStatus: RouteStatus,
  targetRouteStatus: RouteStatus
): boolean {
  return allowedRouteStatusTransitions[currentRouteStatus].includes(
    targetRouteStatus
  )
}
