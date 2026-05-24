import { DriversTable } from "@/components/tables/drivers-table"
import AddDriverModal from "@/components/add/add-driver-modal";
import { env } from "process";

export default async function DriverPage() {
  const response = await fetch(`${env.API_BASE_URL}/api/Driver/all`, { 
    cache: 'no-store' 
  });

  if (!response.ok) {
    return (
      <div className="p-6 text-red-500 font-medium">
        ❌ Помилка завантаження даних (Статус: {response.status})
      </div>
    );
  }

  const drivers = await response.json();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Водії</h1>
          <p className="text-muted-foreground text-sm">
            Управління водіями вашого автопарку та перегляд їхніх ліцензій.
          </p>
        </div>
        <AddDriverModal />
      </div>

      {/* Передаємо отримані з бекенду дані в наш новий компонент */}
      <DriversTable data={drivers} />
    </div>
  );
}