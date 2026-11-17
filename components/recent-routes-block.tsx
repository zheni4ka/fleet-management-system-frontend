import { getLocale, getTranslations } from "next-intl/server"
import { resolveAppLocale } from "@/lib/app-locale"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { formatUtcDateTimeWithTimeZone } from "@/lib/zoned-date-time"
import { LoadErrorMessage } from "@/components/load-error-message"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import {
  apiEndpoints,
  listPaging,
  recentRoutesBlockSettings,
  recentRoutesTableColumns,
} from "@/lib/constants"
import {
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
  const appLocale = resolveAppLocale(await getLocale())
  const routeStatusTranslations = await getTranslations("routeStatus")
  const homeTranslations = await getTranslations("home")
  const routeTranslations = await getTranslations("routes")
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
        errorMessage={homeTranslations("recentRoutesLoadFailed", {
          errorMessage: recentRoutesResult.errorMessage,
        })}
      />
    )
  }

  const recentRoutes = recentRoutesResult.data.items

  if (recentRoutes.length === 0) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        {routeTranslations("emptyList")}
      </p>
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
                  {formatUtcDateTimeWithTimeZone(
                    route.departureTimeUtc,
                    route.startLocationTimeZoneId,
                    appLocale
                  )}
                </TableCell>
                <TableCell className="text-xs">
                  {formatUtcDateTimeWithTimeZone(
                    route.arrivalTimeUtc,
                    route.destinationLocationTimeZoneId,
                    appLocale
                  )}
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
                    {routeStatusTranslations(route.status)}
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
