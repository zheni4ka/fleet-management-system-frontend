import React from 'react';
import { Inter } from 'next/font/google';
import RouteCard from '@/components/route-card';
import { Route, Auto, Driver } from '@/lib/types';
import AddRouteModal from '@/components/add/add-route-modal';
import { env } from 'process';

const inter = Inter({ subsets: ['latin'] });

interface PageProps {
  className?: string;
}


export const RoutesPage: React.FC<PageProps> = async ({ className }) => {
  const sampleRoutes: Route[] = await fetch(`${env.API_BASE_URL}/api/Route/all`, { cache: 'no-store' }).then(res => res.ok ? res.json() : []);
  const [autosRes, driversRes] = await Promise.all([
    fetch(`${env.API_BASE_URL}/api/Auto/all`, { cache: 'no-store' }),
    fetch(`${env.API_BASE_URL}/api/Driver/all`, { cache: 'no-store' }),
  ]);

  if (!autosRes.ok || !driversRes.ok) {
    return (
      <div className="p-6 text-red-500 font-medium">❌ Помилка завантаження даних для авто або водіїв.</div>
    );
  }

  const autos: Auto[] = await autosRes.json();
  const drivers: Driver[] = await driversRes.json();

  const autoMap = new Map<number, string>();
  autos.forEach((a) => autoMap.set(a.id, `${a.mark} ${a.model} ${a.number}`));

  const driverMap = new Map<number, string>();
  drivers.forEach((d) => driverMap.set(d.id, `${d.name} ${d.surname}`));

  return (
    <div className={`${className ?? ''} p-8 max-w-6xl mx-auto space-y-6`}>
      <div className="space-y-2">
        <h1 className={`text-3xl font-bold ${inter.className}`}>Маршрути</h1>
        <p className="text-sm text-slate-600">Перегляд доступних маршрутів із деталями відправлення, прибуття, автомобіля та водія.</p>
        <AddRouteModal />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sampleRoutes.map((route) => (
          <RouteCard
            key={route.id}
            start={route.start}
            destination={route.destination}
            departureTime={route.departureTime}
            arrivalTime={route.arrivalTime}
            autoId={route.autoId}
            driverId={route.driverId}
            autoName={route.autoId ? autoMap.get(route.autoId) : undefined}
            driverName={route.driverId ? driverMap.get(route.driverId) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default RoutesPage;