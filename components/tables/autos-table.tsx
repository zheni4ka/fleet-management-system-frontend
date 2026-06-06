"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Inter } from "next/font/google"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Auto } from "@/lib/types"
import EditAutoModal from "../edit/edit-auto-modal"
import toast from "react-hot-toast"
import AutoMaintenanceModal from "../add/add-maintenance-modal"
import { Input } from "../ui/input" // ПЕРЕВІР ТА ДОДАЙ ЦЕЙ ІМПОРТ

const inter = Inter({ subsets: ["latin"] })

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null
  return null
}

const autoStatusLabel = (status: string | number) => {
  switch (status) {
    case 0:
    case "Available":
      return "Доступне"
    case 1:
    case "InService":
      return "В експлуатації"
    case 2:
    case "UnderMaintenance":
      return "На техобслуговуванні"
    default:
      return "Невідомо"
  }
}

export const AutosTable: React.FC<AutosTableProps> = ({ data = [] }) => {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("") // Стан для пошуку

  // Фільтрація автомобілів на основі пошукового запиту
  const filteredAutos = (data || []).filter((auto) => {
    const search = searchQuery.toLowerCase()
    return (
      auto.mark?.toLowerCase().includes(search) ||
      auto.model?.toLowerCase().includes(search) ||
      auto.number?.toLowerCase().includes(search) ||
      auto.color?.toLowerCase().includes(search)
    )
  })

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете видалити автомобіль?"
    )
    if (!confirmed) return

    const token = getCookie("token")
    if (!token) {
      toast.error("Помилка авторизації. Увійдіть в систему.")
      return
    }

    setDeletingId(id)
    
    const base = (process.env as { NEXT_PUBLIC_API_BASE_URL?: string }).NEXT_PUBLIC_API_BASE_URL ?? ""
    const url = base ? `${base}/api/Auto/${id}` : `/api/Auto/${id}`

    const deletePromise = fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Помилка сервера: ${res.status}`)
      }
    })

    toast.promise(deletePromise, {
      loading: "Видалення автомобіля...",
      success: "Автомобіль успішно видалено!",
      error: (err) => err.message || "Не вдалося видалити автомобіль",
    })

    try {
      await deletePromise
      router.refresh()
    } catch (error) {
      console.error("Не вдалося видалити автомобіль:", error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Пошук авто (марка, модель, колір, номер)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm bg-white shadow-sm"
        />
      </div>


      <div className="rounded-md border bg-white overflow-hidden mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`w-1/12 ${inter.className}`}>ID</TableHead>
              <TableHead className={`w-1/6 ${inter.className}`}>Марка</TableHead>
              <TableHead className={`w-1/6 ${inter.className}`}>Модель</TableHead>
              <TableHead className={`w-1/6 ${inter.className}`}>Колір</TableHead>
              <TableHead className={`w-1/6 ${inter.className}`}>Статус</TableHead>
              <TableHead className={`w-1/6 ${inter.className}`}>Номер</TableHead>
              <TableHead className={`w-1/6 ${inter.className} text-center`}>
                Операції
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Мапимо ТІЛЬКИ відфільтрований масив filteredAutos */}
            {filteredAutos.length > 0 ? (
              filteredAutos.map((auto) => (
                <TableRow key={auto.id} className="hover:bg-slate-50/50">
                  <TableCell className={`font-mono text-xs ${inter.className}`}>
                    {auto.id}
                  </TableCell>
                  <TableCell className={`font-medium ${inter.className}`}>
                    {auto.mark}
                  </TableCell>
                  <TableCell className={`${inter.className}`}>
                    {auto.model}
                  </TableCell>
                  <TableCell className={`${inter.className}`}>
                    {auto.color}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-700/10 ring-inset">
                      {autoStatusLabel(auto.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                      {auto.number}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <AutoMaintenanceModal autoId={auto.id} autoTitle={`${auto.mark} ${auto.model}`} />
                      <EditAutoModal auto={auto} />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(auto.id)}
                        disabled={deletingId === auto.id}
                      >
                        Видалити
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {data.length === 0 ? "Автомобілів поки немає в системі." : "Нічого не знайдено за вашим запитом."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default AutosTable