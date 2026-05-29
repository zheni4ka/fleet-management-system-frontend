import React from 'react';
import { RouteCardProps } from '@/lib/types';

const statusLabel = (status: string | number | undefined) => {
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
      return status ?? 'Невідомо'
  }
}

export const RouteCard: React.FC<RouteCardProps> = ({
  startLocationName,
  destinationLocationName,
  departureTime,
  arrivalTime,
  autoId,
  driverId,
  autoName,
  driverName,
  status,
}) => {
  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-150">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {startLocationName ?? 'Невідома локація'} → {destinationLocationName ?? 'Невідома локація'}
        </h3>
        <p className="text-sm text-slate-600">Час відправлення: {departureTime}</p>
        <p className="text-sm text-slate-600">Час прибуття: {arrivalTime}</p>
        {status !== undefined && <p className="text-sm text-slate-600">Статус: {statusLabel(status)}</p>}
      </div>
      <div className="text-sm text-slate-700 space-y-1">
        {autoName ? (
          <p>Автомобіль: {autoName}</p>
        ) : (
          autoId !== undefined && <p>Авто ID: {autoId}</p>
        )}

        {driverName ? (
          <p>Водій: {driverName}</p>
        ) : (
          driverId !== undefined && <p>Водій ID: {driverId}</p>
        )}
      </div>
    </div>
  );
};

export default RouteCard;
