import React from 'react';
import AutosTable from '@/components/tables/autos-table';
import AddAutoModal from '@/components/add/add-auto-modal';
import { env } from 'process';
interface Props {
  className?: string;
}

export const AutosPage: React.FC<Props> = async ({ className }) => {
    
    const response = await fetch(`${env.API_BASE_URL}/api/Auto/all`, { 
    cache: 'no-store' 
  });

    if(!response.ok)
    {
        return (
            <div className="p-6 text-red-500 font-medium">
                ❌ Помилка завантаження даних (Статус: {response.status})
            </div>
        );
    }

    const autos = await response.json();

    return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Автомобілі</h1>
              <p className="text-muted-foreground text-sm">
                Управління автомобілями вашого автопарку та перегляд їхніх характеристик.
              </p>
            </div>
            <AddAutoModal />
          </div>
    
          <AutosTable data={autos} />
        </div>
  );
};

export default AutosPage;