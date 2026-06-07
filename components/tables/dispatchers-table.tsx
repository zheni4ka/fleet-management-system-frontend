"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Inter } from "next/font/google"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { Input } from "../ui/input"

const inter = Inter({ subsets: ["latin"] })

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null
  return null
}

export function DispatchersTable({ data = [] }: { data: any[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null) // ID користувача у Identity зазвичай string (GUID)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDispatchers = (data || []).filter((user) => {
    const search = searchQuery.toLowerCase()
    return (
      user.username?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    )
  })

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Ви впевнені, що хочете видалити цього диспетчера?")
    if (!confirmed) return

    const token = getCookie("token")
    if (!token) {
      toast.error("Помилка авторизації.")
      return
    }

    setDeletingId(id)
    
    const base = (process.env as { NEXT_PUBLIC_API_BASE_URL?: string }).NEXT_PUBLIC_API_BASE_URL ?? ""
    // ВИКОРИСТОВУЄМО ВАШ КОНТРОЛЕР ACCOUNT
    const url = base ? `${base}/api/Account/${id}` : `/api/Account/${id}`

    const deletePromise = fetch(url, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Помилка сервера: ${res.status}`)
      }
    })

    toast.promise(deletePromise, {
      loading: "Видалення облікового запису...",
      success: "Диспетчера успішно видалено!",
      error: (err) => err.message || "Не вдалося видалити користувача",
    })

    try {
      await deletePromise
      router.refresh()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Пошук диспетчера..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm bg-white shadow-sm"
        />
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`w-1/4 ${inter.className}`}>ID</TableHead>
              <TableHead className={`w-1/4 ${inter.className}`}>Логін</TableHead>
              <TableHead className={`w-1/4 ${inter.className}`}>Email</TableHead>
              <TableHead className={`w-1/4 ${inter.className} text-center`}>Операції</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDispatchers.length > 0 ? (
              filteredDispatchers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/50">
                  <TableCell className={`font-mono text-xs ${inter.className}`}>{user.id}</TableCell>
                  <TableCell className={`font-medium ${inter.className}`}>{user.username}</TableCell>
                  <TableCell className={`${inter.className}`}>{user.email || "—"}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                    >
                      Видалити
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  {data.length === 0 ? "Диспетчерів поки немає." : "Нічого не знайдено."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default DispatchersTable