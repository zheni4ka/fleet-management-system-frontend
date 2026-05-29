import React from 'react'

interface KpiItem {
  label: string
  value: number | string
  className?: string
}

const KpiCard: React.FC<{item: KpiItem}> = ({ item }) => (
  <div className="flex-1 p-4  bg-white/5 rounded-lg shadow-sm border border-white/5">
    <div className="text-xs text-muted-foreground">{item.label}</div>
    <div className="mt-2 text-2xl font-semibold">{item.value}</div>
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
      <div className="p-4 text-red-500 font-medium">❌ Не вдалося завантажити дані для KPI.</div>
    );
  }

  const autos = await resAuto.json();
  const drivers = await resDriver.json();
  const routes = await resRoute.json();

  const defaults: KpiItem[] = [
    { label: 'Авто', value: autos.length },
    { label: 'Водії', value: drivers.length },
    { label: 'Маршрути', value: routes.length },
    { label: 'Актуальні маршрути', value: routes.filter((r: { active: boolean }) => r.active).length },
  ];

  const items = data ?? defaults;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it) => (
        <KpiCard key={it.label} item={it} />
      ))}
    </div>
  );
}

export default KpiPanel