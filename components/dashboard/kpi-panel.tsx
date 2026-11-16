import {
  Activity,
  LucideIcon,
  Map as MapIcon,
  Truck,
  Users,
} from "lucide-react"
import { LoadErrorMessage } from "@/components/load-error-message"
import { apiEndpoints } from "@/lib/constants"
import { fetchFromApi } from "@/lib/server/api"
import { DashboardSummary } from "@/lib/types"

interface KpiCardProps {
  label: string
  value: number | string
  description: string
  icon: LucideIcon
  colorClassName: string
}

function KpiCard({
  label,
  value,
  description,
  icon: KpiIcon,
  colorClassName,
}: KpiCardProps) {
  return (
    <div className="group relative flex-1 overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-indigo-100">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className={`rounded-xl p-2.5 transition-colors ${colorClassName}`}>
          <KpiIcon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <div className="text-4xl font-bold tracking-tight text-slate-900">
          {value}
        </div>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 scale-x-0 bg-linear-to-r from-indigo-500 to-blue-500 group-hover:scale-x-100 motion-safe:transition-transform motion-safe:duration-300" />
    </div>
  )
}

interface KpiPanelProps {
  authToken: string
}

export async function KpiPanel({ authToken }: KpiPanelProps) {
  const dashboardSummaryResult = await fetchFromApi<DashboardSummary>(
    apiEndpoints.dashboardSummary,
    authToken
  )

  if (!dashboardSummaryResult.isSucceeded) {
    return (
      <LoadErrorMessage
        errorMessage={`Не вдалося завантажити аналітичні дані. ${dashboardSummaryResult.errorMessage}`}
      />
    )
  }

  const dashboardSummary = dashboardSummaryResult.data
  const activeRoutesPercentage =
    dashboardSummary.routesCount > 0
      ? Math.round(
          (dashboardSummary.activeRoutesCount / dashboardSummary.routesCount) *
            100
        )
      : 0

  const kpiCards: KpiCardProps[] = [
    {
      label: "Усього авто",
      value: dashboardSummary.autosCount,
      description: "Зареєстровано в базі",
      icon: Truck,
      colorClassName: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    },
    {
      label: "Усього водіїв",
      value: dashboardSummary.driversCount,
      description: "Зареєстровано в базі",
      icon: Users,
      colorClassName:
        "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
    },
    {
      label: "Активні рейси",
      value: dashboardSummary.activeRoutesCount,
      description: `Із ${dashboardSummary.routesCount} загальних маршрутів`,
      icon: MapIcon,
      colorClassName: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100",
    },
    {
      label: "Завантаженість",
      value: `${activeRoutesPercentage}%`,
      description: "Відсоток активних маршрутів",
      icon: Activity,
      colorClassName: "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
    },
  ]

  return (
    <div className="flex w-full flex-col justify-center gap-4 sm:flex-row">
      {kpiCards.map((kpiCard) => (
        <KpiCard key={kpiCard.label} {...kpiCard} />
      ))}
    </div>
  )
}

export default KpiPanel
