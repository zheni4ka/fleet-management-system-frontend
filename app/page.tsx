import KpiPanel from "@/components/dashboard/KpiPanel"
import Link from "next/link"
import RecentRoutesBlock from "@/components/recent-routes-block"
import FastAccess from "@/components/fast-access"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/login")
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col space-y-8 p-6 pt-8 bg-slate-50/50">
      
      <div className="relative overflow-hidden rounded-3xlp-8 text-black shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Огляд автопарку
          </h1>
          <p className="mt-2 text-slate-300 text-lg">
            Актуальна статистика та управління логістикою на сьогодні.
          </p>
        </div>
        
      </div>

      <div className="w-full mt-4 mb-4">
        <KpiPanel />
      </div>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-3 space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-800">
              Останні маршрути
            </h2>
            <Link
              href="/route"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              Переглянути всі →
            </Link>
          </div>
          <RecentRoutesBlock />
        </div>

        <div className="lg:col-span-1 space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-xl font-bold tracking-tight text-slate-800 mt-4">
            Швидкий доступ
          </h2>
          <FastAccess />
        </div>
      </div>
    </div>
  )
}