import { LucideIcon } from "lucide-react"
import { RouteStatus } from "./route-status"

export interface RouteStatusAction {
  targetRouteStatus: RouteStatus
  label: string
  icon: LucideIcon
  className: string
}
