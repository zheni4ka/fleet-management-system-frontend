import { useTranslations } from "next-intl"
import * as React from "react"
import { Info, Trash2 } from "lucide-react"
import { IconActionButton } from "@/components/icon-action-button"
import { RouteStatusBadge } from "@/components/route-status-badge"
import { Button } from "@/components/ui/button"
import { routeStatusActions } from "@/lib/constants"
import { canRouteStatusChangeTo } from "@/lib/route-status"
import { Route, RouteStatus } from "@/lib/types"

interface RouteCardProps {
  route: Route
  startLocationName: string
  destinationLocationName: string
  driverFullName: string
  isRouteUpdating: boolean
  editRouteAction: React.ReactNode
  onSelect: () => void
  onStatusChange: (targetRouteStatus: RouteStatus) => void
  onDelete: () => void
}

export function RouteCard({
  route,
  startLocationName,
  destinationLocationName,
  driverFullName,
  isRouteUpdating,
  editRouteAction,
  onSelect,
  onStatusChange,
  onDelete,
}: RouteCardProps) {
  const iconActionTranslations = useTranslations("iconActions")
  const routeTranslations = useTranslations("routes")
  const routeStatusActionTranslations = useTranslations("routeStatusActions")
  const availableRouteStatusActions = routeStatusActions.filter(
    (routeStatusAction) =>
      canRouteStatusChangeTo(route.status, routeStatusAction.targetRouteStatus)
  )

  return (
    <article className="flex h-full flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-slate-500">
            #{route.id}
          </span>
          <RouteStatusBadge routeStatus={route.status} />
        </div>
        <div className="flex items-center gap-1">
          <IconActionButton
            icon={Info}
            label={iconActionTranslations("viewDetails")}
            variant="outline"
            onClick={onSelect}
          />
          {editRouteAction}
          <IconActionButton
            icon={Trash2}
            label={iconActionTranslations("delete")}
            variant="destructive"
            disabled={isRouteUpdating}
            onClick={onDelete}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSelect}
        className="cursor-pointer text-left leading-snug font-semibold text-slate-900 hover:text-indigo-700"
      >
        {startLocationName} → {destinationLocationName}
      </button>

      <p className="text-sm">
        <span className="text-slate-500">
          {routeTranslations("cardDriverLabel")}:{" "}
        </span>
        <span className="text-slate-800">{driverFullName}</span>
      </p>

      {availableRouteStatusActions.length > 0 && (
        <div className="mt-auto flex gap-2 border-t border-slate-100 pt-3">
          {availableRouteStatusActions.map((routeStatusAction) => {
            const RouteStatusActionIcon = routeStatusAction.icon
            return (
              <Button
                key={routeStatusAction.targetRouteStatus}
                type="button"
                size="sm"
                disabled={isRouteUpdating}
                variant={routeStatusAction.variant}
                className="flex-1"
                onClick={() =>
                  onStatusChange(routeStatusAction.targetRouteStatus)
                }
              >
                <RouteStatusActionIcon aria-hidden="true" />
                {routeStatusActionTranslations(
                  routeStatusAction.targetRouteStatus
                )}
              </Button>
            )
          })}
        </div>
      )}
    </article>
  )
}

export default RouteCard
