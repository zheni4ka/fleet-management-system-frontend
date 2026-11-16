import * as React from "react"
import { MapIcon, Trash2 } from "lucide-react"
import { IconActionButton } from "@/components/icon-action-button"
import { Button } from "@/components/ui/button"
import {
  iconActionLabels,
  routeStatusActions,
  routeStatusBadgeClassNames,
  routeStatusLabels,
} from "@/lib/constants"
import { formatUtcDateTimeWithTimeZone } from "@/lib/zoned-date-time"
import { canRouteStatusChangeTo } from "@/lib/route-status"
import { Route, RouteStatus } from "@/lib/types"

interface RouteCardProps {
  route: Route
  startLocationName: string
  destinationLocationName: string
  autoTitle: string
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
  autoTitle,
  driverFullName,
  isRouteUpdating,
  editRouteAction,
  onSelect,
  onStatusChange,
  onDelete,
}: RouteCardProps) {
  const availableRouteStatusActions = routeStatusActions.filter(
    (routeStatusAction) =>
      canRouteStatusChangeTo(route.status, routeStatusAction.targetRouteStatus)
  )

  const routeDetailRows = [
    {
      label: "Виїзд",
      value: formatUtcDateTimeWithTimeZone(
        route.departureTimeUtc,
        route.startLocationTimeZoneId
      ),
    },
    {
      label: "Прибуття",
      value: formatUtcDateTimeWithTimeZone(
        route.arrivalTimeUtc,
        route.destinationLocationTimeZoneId
      ),
    },
    { label: "Авто", value: autoTitle },
    { label: "Водій", value: driverFullName },
  ]

  return (
    <article className="flex h-full flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-slate-500">
            #{route.id}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${routeStatusBadgeClassNames[route.status]}`}
          >
            {routeStatusLabels[route.status]}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <IconActionButton
            icon={MapIcon}
            label={iconActionLabels.viewOnMap}
            variant="outline"
            onClick={onSelect}
          />
          {editRouteAction}
          <IconActionButton
            icon={Trash2}
            label={iconActionLabels.delete}
            variant="destructive"
            disabled={isRouteUpdating}
            onClick={onDelete}
          />
        </div>
      </div>

      <h3 className="leading-snug font-semibold text-slate-900">
        {startLocationName} → {destinationLocationName}
      </h3>

      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm">
        {routeDetailRows.map((routeDetailRow) => (
          <React.Fragment key={routeDetailRow.label}>
            <dt className="text-slate-500">{routeDetailRow.label}</dt>
            <dd className="truncate text-slate-800">{routeDetailRow.value}</dd>
          </React.Fragment>
        ))}
      </dl>

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
                {routeStatusAction.label}
              </Button>
            )
          })}
        </div>
      )}
    </article>
  )
}

export default RouteCard
