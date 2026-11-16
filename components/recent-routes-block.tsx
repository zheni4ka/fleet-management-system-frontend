import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { LoadErrorMessage } from "@/components/load-error-message"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import {
  apiEndpoints,
  listPaging,
  recentRoutesBlockSettings,
  recentRoutesTableColumns,
  routeStatusLabels,
} from "@/lib/constants"
import {
  formatDateTime,
  formatRouteDestinationLocationName,
  formatRouteStartLocationName,
} from "@/lib/formatters"
import { isRouteStatusActive } from "@/lib/route-status"
import { createListApiPath } from "@/lib/search-params"
import { fetchFromApi } from "@/lib/server/api"
import { RouteSortField, SortDirection } from "@/lib/types"
import { createPagedListSchema } from "@/lib/schemas/paged-list-schema"
import { routeSchema } from "@/lib/schemas/route-schema"

interface RecentRoutesBlockProps {
  authToken: string
}

export async function RecentRoutesBlock({ authToken }: RecentRoutesBlockProps) {
  const recentRoutesResult = await fetchFromApi(
    createListApiPath(apiEndpoints.routesPagedList, {
      page: listPaging.firstPage,
      pageSize: recentRoutesBlockSettings.routesCount,
      sort: RouteSortField.Id,
      sortDirection: SortDirection.Descending,
      search: "",
    }),
    authToken,
    createPagedListSchema(routeSchema)
  )

  if (!recentRoutesResult.isSucceeded) {
    return (
      <LoadErrorMessage
        errorMessage={`Не вдалося завантажити маршрути. ${recentRoutesResult.errorMessage}`}
      />
    )
  }

  const recentRoutes = recentRoutesResult.data.items

  if (recentRoutes.length === 0) {
    return (
      <p className="p-4 text-sm text-muted-foreground">Маршрутів поки немає.</p>
    )
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
                  {formatRouteStartLocationName(route)} →{" "}
                  {formatRouteDestinationLocationName(route)}
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
