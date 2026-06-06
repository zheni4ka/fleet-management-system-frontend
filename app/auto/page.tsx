import React from "react"
import AutosTable from "@/components/tables/autos-table"
import AddAutoModal from "@/components/add/add-auto-modal"
import { env } from "process"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserRole } from "@/lib/utils"
interface Props {
  className?: string
}


export default async function AutosPage({ className }: Props) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/login")
  }

  const role = getUserRole(token);
  if (role !== "Admin") {
    redirect("/") // Якщо це не адмін, викидаємо на головну сторінку
  }

  const response = await fetch(`${env.API_BASE_URL}/api/Auto/all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    if (response.status === 401) {
      redirect("/login")
    }
    return (
      <div className="p-6 font-medium text-red-500">
        Помилка завантаження даних (Статус: {response.status})
      </div>
    )
  }

  const autos = await response.json()

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Автомобілі</h1>
          <p className="text-sm text-muted-foreground">
            Управління автомобілями вашого автопарку та перегляд їхніх
            характеристик.
          </p>
        </div>
        <AddAutoModal />
      </div>

      <AutosTable data={autos} />
    </div>
  )
}

