import React from 'react';
import { env } from 'process';
import { Inter } from 'next/font/google';
import { Route, Auto, Driver, Location } from '@/lib/types';
import AddRouteModal from '@/components/add/add-route-modal';
import RoutesList from '@/components/routes-list';

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
  
  // Перетворюємо в масиви кортежів, оскільки об'єкт Map не можна напряму передати з серверного компонента в клієнтський
  const autoMapData: [number, string][] = autos.map((a) => [a.id, `${a.mark} ${a.model} ${a.number}`]);
  const driverMapData: [number, string][] = drivers.map((d) => [d.id, `${d.name} ${d.surname}`]);

  return (
    <div className={`${className ?? ''} p-8 max-w-6xl mx-auto space-y-6`}>
      <div className="space-y-2">
        <h1 className={`text-3xl font-bold ${inter.className}`}>Маршрути</h1>
        <p className="text-sm text-slate-600">Перегляд доступних маршрутів із деталями відправлення, прибуття, автомобіля та водія.</p>
        <AddRouteModal />
      </div>

      {/* Передаємо завантажені дані у клієнтський компонент, де працює useState */}
      <RoutesList 
        initialRoutes={sampleRoutes}
        locations={locations}
        autoMapData={autoMapData}
        driverMapData={driverMapData}
      />
    </div>
  );
};

export default RoutesPage;