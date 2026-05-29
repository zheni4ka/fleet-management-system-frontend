import React from 'react';
import { Inter } from 'next/font/google';
import RouteCard from '@/components/route-card';
import { Route, Auto, Driver, Location } from '@/lib/types';
import AddRouteModal from '@/components/add/add-route-modal';
import { env } from 'process';

const inter = Inter({ subsets: ['latin'] });

interface PageProps {
  className?: string;
}


export const RoutesPage: React.FC<PageProps> = async ({ className }) => {
  const [routesRes, autosRes, driversRes, locationsRes] = await Promise.all([
    fetch(`${env.API_BASE_URL}/api/Route/all`, { cache: 'no-store' }),
    fetch(`${env.API_BASE_URL}/api/Auto/all`, { cache: 'no-store' }),
    fetch(`${env.API_BASE_URL}/api/Driver/all`, { cache: 'no-store' }),
    fetch(`${env.API_BASE_URL}/api/Location/all`, { cache: 'no-store' }),
  ]);

  if (!routesRes.ok || !autosRes.ok || !driversRes.ok || !locationsRes.ok) {
    return (
      <div className="p-6 text-red-500 font-medium">❌ Помилка завантаження даних для маршрутів, авто, водіїв або локацій.</div>
    );
  }

  const sampleRoutes: Route[] = await routesRes.json();
  const autos: Auto[] = await autosRes.json();
  const drivers: Driver[] = await driversRes.json();
  const locations: Location[] = await locationsRes.json();

  const autoMap = new Map<number, string>();
  autos.forEach((a) => autoMap.set(a.id, `${a.mark} ${a.model} ${a.number}`));

  const driverMap = new Map<number, string>();
  drivers.forEach((d) => driverMap.set(d.id, `${d.name} ${d.surname}`));

  const locationMap = new Map<number, string>();
  locations.forEach((loc) => locationMap.set(loc.id, `${loc.city}, ${loc.country}`));

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
            startLocationName={locationMap.get(route.startLocationId)}
            destinationLocationName={locationMap.get(route.destinationLocationId)}
            departureTime={route.departureTime}
            arrivalTime={route.arrivalTime}
            autoId={route.autoId}
            driverId={route.driverId}
            autoName={route.autoId ? autoMap.get(route.autoId) : undefined}
            driverName={route.driverId ? driverMap.get(route.driverId) : undefined}
            status={route.status}
          />
        ))}
      </div>
    </div>
  );
};

export default RoutesPage;