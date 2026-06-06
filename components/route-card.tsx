import React from 'react';
import { RouteCardProps, RouteStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ExtendedRouteCardProps extends RouteCardProps {
  onStatusChange?: (e: React.MouseEvent, newStatus: RouteStatus) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

const statusLabel = (status: string | number | undefined) => {
  // Конвертуємо в рядок для надійної перевірки
  switch (String(status)) {
    case '0':
    case 'Planned': return 'Заплановано'
    case '1':
    case 'InProgress': return 'В процесі'
    case '2':
    case 'Completed': return 'Виконано'
    case '3':
    case 'Cancelled': return 'Скасовано'
    default: return status ?? 'Невідомо'
  }
}

export const RouteCard: React.FC<ExtendedRouteCardProps> = ({
  startLocationName,
  destinationLocationName,
  departureTime,
  arrivalTime,
  autoId,
  driverId,
  autoName,
  driverName,
  status,
  onStatusChange,
  onDelete
}) => {
  const strStatus = String(status);
  const isPlanned = strStatus === 'Planned';
  const isInProgress = strStatus === 'InProgress';
  const Completed = strStatus === 'Completed';
  const Cancelled = strStatus === 'Cancelled'

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-150">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {startLocationName ?? 'Невідома локація'} → {destinationLocationName ?? 'Невідома локація'}
          </h3>
          <p className="text-sm text-slate-600">Час відправлення: {new Date(departureTime).toLocaleString('uk-UA')}</p>
          <p className="text-sm text-slate-600">Час прибуття: {new Date(arrivalTime).toLocaleString('uk-UA')}</p>
          {status !== undefined && (
            <p className="text-sm text-slate-600">
              Статус: <span className="font-medium">{statusLabel(status)}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
            <Button  className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={(e) => onStatusChange?.(e, 'InProgress')}>
              Розпочати
            </Button>
            <Button className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={(e) => onStatusChange?.(e, 'Completed')}>
              Завершити
            </Button>
            <Button className="h-8 text-xs border-orange-200 text-orange-600 hover:bg-orange-50" onClick={(e) => onStatusChange?.(e, 'Cancelled')}>
              Скасувати
            </Button>
          
            <Button className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white mt-1" onClick={onDelete}>
              <Trash2 className="w-3 h-3 mr-1" /> Видалити
            </Button>
        </div>
      </div>
      
      <div className="text-sm text-slate-700 space-y-1">
        {autoName ? <p>Автомобіль: {autoName}</p> : (autoId !== undefined && <p>Авто ID: {autoId}</p>)}
        {driverName ? <p>Водій: {driverName}</p> : (driverId !== undefined && <p>Водій ID: {driverId}</p>)}
      </div>
    </div>
  );
};

export default RouteCard;