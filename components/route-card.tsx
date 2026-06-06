import React from "react"
import { RouteCardProps, RouteStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Trash2, Play, CheckCircle, XCircle } from "lucide-react"

interface ExtendedRouteCardProps extends RouteCardProps {
  onStatusChange?: (e: React.MouseEvent, newStatus: RouteStatus) => void
  onDelete?: (e: React.MouseEvent) => void
  isLoading?: boolean
}

const getStatusText = (status: string | number | undefined) => {
  const s = String(status)
  if (s === "0" || s === "Planned") return "Заплановано"
  if (s === "1" || s === "InProgress") return "В процесі"
  if (s === "2" || s === "Completed") return "Виконано"
  if (s === "3" || s === "Cancelled") return "Скасовано"
  return "Невідомо"
}

export const RouteCard: React.FC<ExtendedRouteCardProps> = ({
  startLocationName,
  destinationLocationName,
  departureTime,
  arrivalTime,
  autoId,
  driverId,
  autoName,
  driverName,
  status,
  onStatusChange,
  onDelete,
  isLoading = false,
}) => {
  const s = String(status)
  return (
    <div className="relative flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex-shrink-0 pl-3">
        <h3 className="mb-2 text-lg leading-tight font-bold text-slate-800">
          {startLocationName ?? "Невідома"} → {destinationLocationName ?? "Невідома"} <br />
        </h3>

        <div className="mb-4 space-y-1">
          <p className="text-xs text-slate-500">
            Виїзд:{" "}
            <span className="font-medium text-slate-700">
              {new Date(departureTime).toLocaleString("uk-UA")}
            </span>
          </p>
          <p className="text-xs text-slate-500">
            Прибуття:{" "}
            <span className="font-medium text-slate-700">
              {new Date(arrivalTime).toLocaleString("uk-UA")}
            </span>
          </p>
          <p className="text-xs text-slate-500">
            Статус:{" "}
            <span className="font-semibold text-indigo-600">
              {getStatusText(status)}
            </span>
          </p>
        </div>

        <div className="mb-5 space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
          <p className="text-xs font-medium text-slate-600">
            🚗 {autoName || `Авто ID: ${autoId}`}
          </p>
          <p className="text-xs font-medium text-slate-600">
            👤 {driverName || `Водій ID: ${driverId}`}
          </p>
        </div>
      </div>

      <div className="mt-auto flex w-full flex-col gap-2 pt-4">

        <button
          type="button"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-md bg-blue-600 p-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={(e) => onStatusChange?.(e, "InProgress")}
        >
          <Play className="mr-2 h-4 w-4" /> Розпочати
        </button>

        <a
          type="button"
          className="flex w-full items-center justify-center rounded-md bg-green-600 p-2.5 text-sm font-semibold text-black transition hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={(e) => onStatusChange?.(e, "Completed")}
        >
          <CheckCircle className="mr-2 h-4 w-4" /> Завершити
        </a>

        <button
          type="button"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-md border border-orange-200 p-2.5 text-sm font-semibold text-orange-600 transition hover:bg-orange-50 disabled:border-orange-100 disabled:text-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={(e) => onStatusChange?.(e, "Cancelled")}
        >
          <XCircle className="mr-2 h-4 w-4" /> Скасувати
        </button>

        <a
          type="button"
          className="mt-1 flex w-full items-center justify-center rounded-md bg-red-600 p-2.5 text-sm font-semibold text-black transition hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Видалити
        </a>
      </div>
    </div>
  )
}

export default RouteCard
