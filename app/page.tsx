import KpiPanel from "@/components/dashboard/KpiPanel"
import Link from "next/link"
import RecentRoutesBlock from "@/components/recent-routes-block"
import FastAccess from "@/components/fast-access"

export default function Page() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col space-y-6 p-6 pt-8">
      <div className="space-y-10">
        <h1 className="flex justify-center p-3 text-3xl font-bold tracking-tight">
          Панель управління транспортною логістикою
        </h1>
      </div>

      <div className="w-full">
        <KpiPanel />
      </div>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-3 space-y-4 shadow-sm border rounded-lg p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Останні маршрути
            </h2>
            <Link
              href="/route"
              className="flex items-center gap-0.5 text-xs font-medium text-blue-400 hover:underline"
            >
              Усі маршрути -{">"}
            </Link>
          </div>
          <RecentRoutesBlock />
        </div>

        <div className="lg:col-span-1 space-y-4 shadow-sm border rounded-lg mt-4">
          <FastAccess />
        </div>
      </div>
    </div>
  )
}
