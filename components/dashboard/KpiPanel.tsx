import React from 'react'

interface KpiItem {
  label: string
  value: number | string
  description?: string
}

const KpiCard: React.FC<{item: KpiItem}> = ({ item }) => (
  <div className="p-4 bg-zinc-900/40 rounded-xl shadow-sm border border-white/10 flex flex-col justify-between">
    <div>
      <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
    </div>
    <div className="mt-4">
      <div className="text-3xl font-bold tracking-tight">{item.value}</div>
      {item.description && (
        <p className="text-xs text-muted-foreground mt-1 font-medium">{item.description}</p>
      )}
    </div>
  </div>
)

export const KpiPanel: React.FC<{data?: KpiItem[]}> = async ({ data }) => {
  const [resAuto, resDriver, resRoute] = await Promise.all([
    fetch(`${process.env.API_BASE_URL}/api/Auto/all`, { cache: 'no-store' }),
    fetch(`${process.env.API_BASE_URL}/api/Driver/all`, { cache: 'no-store' }),
    fetch(`${process.env.API_BASE_URL}/api/Route/all`, { cache: 'no-store' })
  ]);
    
  if (!resAuto.ok || !resDriver.ok || !resRoute.ok) {
    console.error('Помилка завантаження даних для KPI:', {
      auto: resAuto.status,
      driver: resDriver.status,
      route: resRoute.status,
    });
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg font-medium text-sm">
        ❌ Не вдалося завантажити аналітичні дані для KPI панелі.
      </div>
    );
  }

  const autos = await resAuto.json();
  const drivers = await resDriver.json();
  const routes = await resRoute.json();

  const activeRoutesCount = routes.filter((route: { status: string | number }) => {
    return route.status === 0 || route.status === 'Planned' || route.status === 1 || route.status === 'InProgress'
  }).length;
  
  // Розрахунок відсотка завантаженості флоту
  const utilizationRate = routes.length > 0 
    ? Math.round((activeRoutesCount / routes.length) * 100) 
    : 0;

  const defaults: KpiItem[] = [
    { 
      label: 'Усього авто', 
      value: autos.length, 
      description: 'Зареєстровано в базі'
    },
    { 
      label: 'Активні водії', 
      value: drivers.length, 
      description: 'Доступно для рейсів'
    },
    { 
      label: 'Активні рейси', 
      value: activeRoutesCount, 
      description: `Із ${routes.length} загальних маршрутів`
    },
    { 
      label: 'Завантаженість', 
      value: `${utilizationRate}%`, 
      description: 'Відсоток активних маршрутів'
    },
  ];

  const items = data ?? defaults;

  return (
    <div className=" justify-center flex flex-row gap-4 w-full">
  {items.map((it) => (
    <KpiCard key={it.label} item={it} />
  ))}
</div>
  );
}

export default KpiPanel;