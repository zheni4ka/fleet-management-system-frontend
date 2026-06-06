import React from 'react'
import { cookies } from 'next/headers'
import { Truck, Users, Map, Activity } from 'lucide-react' // Додаємо іконки

interface KpiItem {
  label: string
  value: number | string
  description?: string
  icon?: React.ReactNode
  colorClass?: string
}

const KpiCard: React.FC<{item: KpiItem}> = ({ item }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-indigo-100 flex-1">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-500">{item.label}</span>
      <div className={`rounded-xl p-2.5 transition-colors ${item.colorClass}`}>
        {item.icon}
      </div>
    </div>
    <div className="mt-4 flex flex-col">
      <div className="text-4xl font-bold tracking-tight text-slate-900">{item.value}</div>
      {item.description && (
        <p className="text-sm text-slate-500 mt-1">{item.description}</p>
      )}
    </div>
    {/* Декоративний градієнт знизу при наведенні */}
    <div className="absolute inset-x-0 bottom-0 h-1 scale-x-0 bg-gradient-to-r from-indigo-500 to-blue-500 transition-transform duration-300 group-hover:scale-x-100" />
  </div>
)

export const KpiPanel: React.FC<{data?: KpiItem[]}> = async ({ data }) => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const headers = {
    "Authorization": `Bearer ${token}`
  }

  const [resAuto, resDriver, resRoute] = await Promise.all([
    fetch(`${process.env.API_BASE_URL}/api/Auto/all`, { headers, cache: 'no-store' }),
    fetch(`${process.env.API_BASE_URL}/api/Driver/all`, { headers, cache: 'no-store' }),
    fetch(`${process.env.API_BASE_URL}/api/Route/all`, { headers, cache: 'no-store' })
  ]);
    
  if (!resAuto.ok || !resDriver.ok || !resRoute.ok) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-medium text-sm ring-1 ring-red-200">
        ❌ Не вдалося завантажити аналітичні дані. Перевірте з`&apos`єднання з сервером.
      </div>
    );
  }

  const autos = await resAuto.json();
  const drivers = await resDriver.json();
  const routes = await resRoute.json();

  const activeRoutesCount = routes.filter((route: { status: string | number }) => {
    return route.status === 0 || route.status === 'Planned' || route.status === 1 || route.status === 'InProgress'
  }).length;
  
  const utilizationRate = routes.length > 0 
    ? Math.round((activeRoutesCount / routes.length) * 100) 
    : 0;

  const defaults: KpiItem[] = [
    { 
      label: 'Усього авто', 
      value: autos.length, 
      description: 'Зареєстровано в базі',
      icon: <Truck className="h-5 w-5" />,
      colorClass: "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
    },
    { 
      label: 'Активні водії', 
      value: drivers.length, 
      description: 'Доступно для рейсів',
      icon: <Users className="h-5 w-5" />,
      colorClass: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
    },
    { 
      label: 'Активні рейси', 
      value: activeRoutesCount, 
      description: `Із ${routes.length} загальних маршрутів`,
      icon: <Map className="h-5 w-5" />,
      colorClass: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"
    },
    { 
      label: 'Завантаженість', 
      value: `${utilizationRate}%`, 
      description: 'Відсоток активних маршрутів',
      icon: <Activity className="h-5 w-5" />,
      colorClass: "bg-orange-50 text-orange-600 group-hover:bg-orange-100"
    },
  ];

  const items = data ?? defaults;

  return (
    <div className="flex flex-col gap-4 sm:flex-row w-full justify-center">
      {items.map((it) => (
        <KpiCard key={it.label} item={it} />
      ))}
    </div>
  );
}

export default KpiPanel;