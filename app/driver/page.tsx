import { DriversTable } from "@/components/tables/drivers-table"
import AddDriverModal from "@/components/add/add-driver-modal"
import { env } from "process"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserRole } from "@/lib/utils"

export default async function DriverPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/login")
  }

  const role = getUserRole(token);
  if (role !== "Admin") {
    redirect("/")
  }

  const response = await fetch(`${env.API_BASE_URL}/api/Driver/all`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {

    if(response.status === 401) { 
      redirect("/login")
    }

    return (
      <div className="p-6 font-medium text-red-500">
        Помилка завантаження даних (Статус: {response.status})
      </div>
    )
  }

  const drivers = await response.json()

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Водії</h1>
          <p className="text-sm text-muted-foreground">
            Управління водіями вашого автопарку та перегляд їхніх ліцензій.
          </p>
        </div>
        <AddDriverModal />
      </div>

      <DriversTable data={drivers} />
    </div>
  )
}
