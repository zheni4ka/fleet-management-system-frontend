import React from "react"
import { Inter } from "next/font/google"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Route, Location } from "@/lib/types"

const inter = Inter({ subsets: ["latin"] })

const getRouteStatusLabel = (status: string | number | undefined) => {
  switch (status) {
    case 0:
    case "Planned":
      return "Заплановано"
    case 1:
    case "InProgress":
      return "В процесі"
    case 2:
    case "Completed":
      return "Виконано"
    case 3:
    case "Cancelled":
      return "Скасовано"
    default:
      return "Невідомо"
  }
}

const isRouteActive = (status: string | number | undefined) => {
  return status === 0 || status === "Planned" || status === 1 || status === "InProgress"
}

async function RecentRoutesBlock() {
    const [routesRes, locationsRes] = await Promise.all([
      fetch(`${process.env.API_BASE_URL}/api/Route/all`, { cache: "no-store" }),
      fetch(`${process.env.API_BASE_URL}/api/Location/all`, { cache: "no-store" }),
    ])

    if (!routesRes.ok || !locationsRes.ok) {
      return (
        <p className="py-2 text-sm text-red-500">
          Не вдалося завантажити маршрути та локації
        </p>
      )
    }

    const allRoutes: Route[] = await routesRes.json()
    const locations: Location[] = await locationsRes.json()
    const recentRoutes = allRoutes.slice(-5).reverse()

    const locationMap = new Map<number, string>()
    locations.forEach((loc) => locationMap.set(loc.id, `${loc.city}, ${loc.country}`))

    if (recentRoutes.length === 0) {
      return <p className="text-muted-foreground">Маршрутів поки немає.</p>
    }

    return (
      <div className="rounded-md border bg-white width-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`w-1/6 ${inter.className}`}>ID</TableHead>
              <TableHead className={`w-2/6 ${inter.className}`}>Звідки → Куди</TableHead>
              <TableHead className={`w-1/6 ${inter.className}`}>Відправлення</TableHead>
              <TableHead className={`w-1/6 ${inter.className}`}>Прибуття</TableHead>
              <TableHead className={`w-1/6 text-right ${inter.className}`}>Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentRoutes.map((route) => {
              const status = route.status ?? (route.status ? "InProgress" : "Completed")
              const active = isRouteActive(status)
              const startLocation = locationMap.get(route.startLocationId) || "Невідома"
              const endLocation = locationMap.get(route.destinationLocationId) || "Невідома"

              return (
                <TableRow key={route.id} className="hover:bg-slate-50/50">
                  <TableCell className={`font-mono text-xs ${inter.className}`}>
                    {route.id}
                  </TableCell>
                  <TableCell className={`font-medium ${inter.className}`}>
                    {startLocation} → {endLocation}
                  </TableCell>
                  <TableCell className={`${inter.className}`}>
                    {route.departureTime || "—"}
                  </TableCell>
                  <TableCell className={`${inter.className}`}>
                    {route.arrivalTime || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        active
                          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-zinc-400"}`}
                      />
                      {getRouteStatusLabel(status)}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
}

export default RecentRoutesBlock