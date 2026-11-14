import Link from "next/link"
import KpiPanel from "@/components/dashboard/kpi-panel"
import RecentRoutesBlock from "@/components/recent-routes-block"
import FastAccess from "@/components/fast-access"
import { appRoutes } from "@/lib/constants"
import { hasAuthTokenUserRole } from "@/lib/auth-token"
import { getAuthTokenOrRedirect } from "@/lib/server/api"
import { UserRole } from "@/lib/types"

export default async function HomePage() {
  const authToken = await getAuthTokenOrRedirect()

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col space-y-8 bg-slate-50/50 p-6 pt-8">
      <div className="relative overflow-hidden rounded-3xl p-8 text-black shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Огляд автопарку
        </h1>
        <p className="mt-2 text-lg text-slate-500">
          Актуальна статистика та управління логістикою на сьогодні.
        </p>
      </div>

      <div className="my-4 w-full">
        <KpiPanel authToken={authToken} />
      </div>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:col-span-2 lg:col-span-3">
          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-800">
              Останні маршрути
            </h2>
            <Link
              href={appRoutes.routes}
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
            >
              Переглянути всі →
            </Link>
          </div>
          <RecentRoutesBlock authToken={authToken} />
        </div>

        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:col-span-1">
          <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-800">
            Швидкий доступ
          </h2>
          <FastAccess
            isAdmin={hasAuthTokenUserRole(authToken, UserRole.Admin)}
          />
        </div>
      </div>
    </div>
  )
}
