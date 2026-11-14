import * as React from "react"
import { Trash2 } from "lucide-react"
import { routeStatusActions, routeStatusLabels } from "@/lib/constants"
import { formatDateTime } from "@/lib/formatters"
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

const routeActionButtonClassName =
  "flex w-full cursor-pointer items-center justify-center rounded-md p-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"

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
  const getIsStatusActionDisabled = (targetRouteStatus: RouteStatus) =>
    isRouteUpdating || !canRouteStatusChangeTo(route.status, targetRouteStatus)

  const routeDetailRows = [
    {
      label: "Виїзд",
      value: formatDateTime(route.departureTime),
      valueClassName: "font-medium text-slate-700",
    },
    {
      label: "Прибуття",
      value: formatDateTime(route.arrivalTime),
      valueClassName: "font-medium text-slate-700",
    },
    {
      label: "Статус",
      value: routeStatusLabels[route.status],
      valueClassName: "font-semibold text-indigo-600",
    },
  ]

  return (
    <div
      onClick={onSelect}
      className="relative flex h-full cursor-pointer flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
    >
      <div className="shrink-0 pl-3">
        <h3 className="mb-2 text-lg leading-tight font-bold text-slate-800">
          {startLocationName} → {destinationLocationName}
        </h3>

        <div className="mb-4 space-y-1">
          {routeDetailRows.map((routeDetailRow) => (
            <p key={routeDetailRow.label} className="text-xs text-slate-500">
              {routeDetailRow.label}:{" "}
              <span className={routeDetailRow.valueClassName}>
                {routeDetailRow.value}
              </span>
            </p>
          ))}
        </div>

        <div className="mb-5 space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
          <p className="text-xs font-medium text-slate-600">🚗 {autoTitle}</p>
          <p className="text-xs font-medium text-slate-600">
            👤 {driverFullName}
          </p>
        </div>
      </div>

      <div
        className="mt-auto flex w-full cursor-default flex-col gap-2 pt-4"
        onClick={(event) => event.stopPropagation()}
      >
        {routeStatusActions.map((routeStatusAction) => {
          const RouteStatusActionIcon = routeStatusAction.icon
          return (
            <button
              key={routeStatusAction.targetRouteStatus}
              type="button"
              disabled={getIsStatusActionDisabled(
                routeStatusAction.targetRouteStatus
              )}
              className={`${routeActionButtonClassName} ${routeStatusAction.className}`}
              onClick={() =>
                onStatusChange(routeStatusAction.targetRouteStatus)
              }
            >
              <RouteStatusActionIcon className="mr-2 h-4 w-4" />{" "}
              {routeStatusAction.label}
            </button>
          )
        })}

        {editRouteAction}

        <button
          type="button"
          disabled={isRouteUpdating}
          className={`${routeActionButtonClassName} mt-1 bg-red-600 text-white hover:bg-red-700`}
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Видалити
        </button>
      </div>
    </div>
  )
}

export default RouteCard
