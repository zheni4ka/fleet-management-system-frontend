import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { LoadErrorMessage } from "@/components/load-error-message"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import {
  apiEndpoints,
  recentRoutesTableColumns,
  routeStatusLabels,
  unknownLocationLabel,
} from "@/lib/constants"
import { formatDateTime, formatLocationName } from "@/lib/formatters"
import { isRouteStatusActive } from "@/lib/route-status"
import { fetchFromApi, getFirstApiFetchErrorMessage } from "@/lib/server/api"
import { Location, Route } from "@/lib/types"

const recentRoutesCount = 5

interface RecentRoutesBlockProps {
  authToken: string
}

export async function RecentRoutesBlock({ authToken }: RecentRoutesBlockProps) {
  const [routesResult, locationsResult] = await Promise.all([
    fetchFromApi<Route[]>(apiEndpoints.allRoutes, authToken),
    fetchFromApi<Location[]>(apiEndpoints.allLocations, authToken),
  ])

  if (!routesResult.isSucceeded || !locationsResult.isSucceeded) {
    return (
      <LoadErrorMessage
        errorMessage={`Не вдалося завантажити маршрути та локації. ${getFirstApiFetchErrorMessage([routesResult, locationsResult])}`}
      />
    )
  }

  const recentRoutes = [...routesResult.data]
    .sort((firstRoute, secondRoute) => secondRoute.id - firstRoute.id)
    .slice(0, recentRoutesCount)

  if (recentRoutes.length === 0) {
    return (
      <p className="p-4 text-sm text-muted-foreground">Маршрутів поки немає.</p>
    )
  }

  const locationsById = new Map(
    locationsResult.data.map((location) => [location.id, location])
  )
  const getLocationName = (locationId: number): string => {
    const location = locationsById.get(locationId)
    return location === undefined
      ? unknownLocationLabel
      : formatLocationName(location)
  }

  return (
    <div className="w-full rounded-md border bg-white">
      <Table>
        <TableColumnsHeader tableColumns={recentRoutesTableColumns} />
        <TableBody>
          {recentRoutes.map((route) => {
            const isRouteActive = isRouteStatusActive(route.status)
            return (
              <TableRow key={route.id} className="hover:bg-slate-50/50">
                <TableCell className="font-mono text-xs">{route.id}</TableCell>
                <TableCell className="font-medium">
                  {getLocationName(route.startLocationId)} →{" "}
                  {getLocationName(route.destinationLocationId)}
                </TableCell>
                <TableCell className="text-xs">
                  {formatDateTime(route.departureTime)}
                </TableCell>
                <TableCell className="text-xs">
                  {formatDateTime(route.arrivalTime)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                      isRouteActive
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                        : "border-zinc-500/20 bg-zinc-500/10 text-zinc-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${isRouteActive ? "bg-emerald-400" : "bg-zinc-400"}`}
                    />
                    {routeStatusLabels[route.status]}
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
