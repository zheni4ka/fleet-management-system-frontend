import { DispatchersTable } from "@/components/tables/dispatchers-table"
import AddDispatcherModal from "@/components/add/add-dispatcher-modal"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserRole } from "@/lib/utils"

export default async function DispatchersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/login")
  }

  const role = getUserRole(token)
  if (role !== "Admin") {
    redirect("/") // Доступ тільки для адміна
  }

  let users = []
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

  try {
    // ЗАПИТ ДО ВАШОГО ACCOUNT КОНТРОЛЕРА
    const res = await fetch(`${base}/api/Account/all`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    
    if (res.ok) {
      users = await res.json()
    }
  } catch (error) {
    console.error("Помилка завантаження диспетчерів:", error)
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Диспетчери
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Управління обліковими записами персоналу.
          </p>
        </div>
        
        {/* Кнопка реєстрації, яка підключена до AccountController */}
        <AddDispatcherModal />
      </div>

      <DispatchersTable data={users} />
    </div>
  )
}