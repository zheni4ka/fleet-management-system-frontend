async function RecentRoutesBlock() {
  const resRoute = await fetch(`${process.env.API_BASE_URL}/api/Route/all`, {
    cache: "no-store",
  })
  if (!resRoute.ok)
    return (
      <p className="py-2 text-sm text-red-500">
        Не вдалося завантажити останні маршрути
      </p>
    )

  const routes = await resRoute.json()
  const recentRoutes = routes.slice(-5).reverse()

  const getRouteStatusLabel = (status: string | number | undefined) => {
    switch (status) {
      case 0:
      case 'Planned':
        return 'Заплановано'
      case 1:
      case 'InProgress':
        return 'В процесі'
      case 2:
      case 'Completed':
        return 'Виконано'
      case 3:
      case 'Cancelled':
        return 'Скасовано'
      default:
        return 'Невідомо'
    }
  }

  const isRouteActive = (status: string | number | undefined) => {
    return status === 0 || status === 'Planned' || status === 1 || status === 'InProgress'
  }

  if (recentRoutes.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Маршрутів поки немає.
      </p>
    )
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-muted-foreground">
            <th className="pb-3 font-medium">Маршрут / ID</th>
            <th className="pb-3 font-medium">Звідки -{">"} Куди</th>
            <th className="pb-3 text-right font-medium">Статус</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {recentRoutes.map((route: { id: string; startPoint?: string; endPoint?: string; status?: string | number; active?: boolean }) => {
            const status = route.status ?? (route.active ? 'InProgress' : 'Completed')
            const active = isRouteActive(status)

            return (
              <tr key={route.id} className="transition-colors hover:bg-white/5">
                <td className="py-3.5 font-mono text-xs text-blue-400">
                  #{route.id}
                </td>
                <td className="py-3.5 font-medium">
                  {route.startPoint || "Початкова точка"} -{">"}{" "}{route.endPoint || "Пункт призначення"}
                </td>
                <td className="py-3.5 text-right">
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
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default RecentRoutesBlock