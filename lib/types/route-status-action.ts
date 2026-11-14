import { LucideIcon } from "lucide-react"
import type { ButtonVariant } from "@/components/ui/button"
import { RouteStatus } from "./route-status"

export interface RouteStatusAction {
  targetRouteStatus: RouteStatus
  label: string
  icon: LucideIcon
  variant: ButtonVariant
}
