import KpiPanel from "@/components/dashboard/KpiPanel"
import Link from "next/link"
import RecentRoutesBlock from "@/components/recent-routes-block"
// Компонент для секції останніх маршрутів (Server Component

export default function Page() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col space-y-6 p-6 pt-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Панель управління флотом
        </h1>
        <p className="text-sm text-muted-foreground">
          Загальний моніторинг автомобілів, водіїв та активності рейсів.
        </p>
      </div>

      <div className="w-full">
        <KpiPanel />
      </div>

      <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-6 shadow-sm lg:col-span-2">
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

        <div className="space-y-4 rounded-xl border border-white/10 bg-zinc-900/40 p-6 shadow-sm lg:col-span-1">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Панель швидкого переходу
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Керування автопарком в один клік
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <div
              className="group flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 py-3.5 transition-all hover:bg-white/10"
            >
              <span className="text-sm font-medium">База водіїв</span>
              <Link href="/driver" className="text-xs text-muted-foreground transition-colors group-hover:text-blue-400">
                Відкрити +
              </Link>
            </div>

            <Link
              href="/auto"
              className="group flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 py-3.5 transition-all hover:bg-white/10"
            >
              <span className="text-sm font-medium">Облік автомобілів</span>
              <span className="text-xs text-muted-foreground transition-colors group-hover:text-blue-400">
                Відкрити +
              </span>
            </Link>

            <Link
              href="/route"
              className="group flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 py-3.5 transition-all hover:bg-white/10"
            >
              <span className="text-sm font-medium">Логістика маршрутів</span>
              <span className="text-xs text-muted-foreground transition-colors group-hover:text-blue-400">
                Відкрити +
              </span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
