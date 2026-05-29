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

  const responseAuto = await fetch(`${process.env.API_BASE_URL}/api/Auto/all`, { 
      cache: 'no-store'
    });
  const responseDriver = await fetch(`${process.env.API_BASE_URL}/api/Driver/all`, { 
      cache: 'no-store'
    });
  const responseRoute = await fetch(`${process.env.API_BASE_URL}/api/Route/all`, { 
      cache: 'no-store'
    });
    
    if(!responseAuto.ok || !responseDriver.ok || !responseRoute.ok) {
      console.error('Помилка завантаження даних для KPI:', {
        auto: responseAuto.ok,
      });
      return (
        <div className="p-4 text-red-500 font-medium">❌ Не вдалося завантажити дані для KPI.</div>
      );
    }

    
  const autos = responseAuto.ok ? await responseAuto.json() : [];
  const drivers = responseDriver.ok ? await responseDriver.json() : [];
  const routes = responseRoute.ok ? await responseRoute.json() : [];



  const defaults: KpiItem[] = [
    { label: 'Авто', value: autos.length },
    { label: 'Водії', value: drivers.length },
    { label: 'Маршрути', value: routes.length },
    //{ label: 'Активні поїздки', value: 3 },
  ]

  const items = data ?? defaults

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {items.map((it) => (
          <KpiCard key={it.label} item={it} />
        ))}
      </div>
    </section>
  )
}

export default KpiPanel
