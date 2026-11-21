import { useTranslations } from "next-intl"
import { routeStatusBadgeClassNames } from "@/lib/constants"
import { RouteStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RouteStatusBadgeProps {
  routeStatus: RouteStatus
}

export function RouteStatusBadge({ routeStatus }: RouteStatusBadgeProps) {
  const routeStatusTranslations = useTranslations("routeStatus")
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        routeStatusBadgeClassNames[routeStatus]
      )}
    >
      {routeStatusTranslations(routeStatus)}
    </span>
  )
}
