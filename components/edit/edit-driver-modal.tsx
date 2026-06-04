"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"
import { Driver } from "@/lib/types"
import toast from "react-hot-toast"

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null
  return null
}

export default function EditDriverModal({ driver }: { driver: Driver }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    name: driver.name,
    surname: driver.surname,
    patronymic: driver.patronymic,
    licenseNumber: driver.licenseNumber,
  })

  const apiBase =
    (process.env as { NEXT_PUBLIC_API_BASE_URL?: string })
      .NEXT_PUBLIC_API_BASE_URL ?? ""

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleSave = async () => {
    const token = getCookie("token")
    if (!token) {
        toast.error("Помилка авторизації. Увійдіть в систему.")
        return
    }

    const updatePromise = fetch(`${apiBase ? apiBase : ""}/api/Driver`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            id: driver.id,
            name: form.name,
            surname: form.surname,
            patronymic: form.patronymic,
            licenseNumber: form.licenseNumber,
        }),
    }).then(async (res) => {
        if (!res.ok) {
            const text = await res.text()
            throw new Error(text || `Помилка сервера: ${res.status}`)
        }
    })

    toast.promise(updatePromise, {
        loading: "Збереження змін...",
        success: "Водія успішно оновлено!",
        error: (err) => err.message || "Не вдалося оновити водія",
    })

    try {
        await updatePromise
        setIsOpen(false)
        router.refresh()
    } catch (error) {
        console.error("Error occurred while updating driver:", error)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="transition-transform duration-300 hover:scale-105"
        onClick={() => {
          setForm({
            name: driver.name,
            surname: driver.surname,
            patronymic: driver.patronymic,
            licenseNumber: driver.licenseNumber,
          })
          setIsOpen(true)
        }}
      >
        Редагувати
      </Button>

      <ModalWindow
        title="Редагувати водія"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="flex flex-col w-full space-y-3">
          <input
            type="text"
            placeholder="Ім'я"
            value={form.name}
            onChange={handleChange("name")}
            className="rounded-md border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"  
          />
          <input
            type="text"
            placeholder="Прізвище"
            value={form.surname}
            onChange={handleChange("surname")}
            className="rounded-md border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="По-батькові"
            value={form.patronymic}
            onChange={handleChange("patronymic")}
            className="rounded-md border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Номер ліцензії"
            value={form.licenseNumber}
            onChange={handleChange("licenseNumber")}
            className="rounded-md border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Button onClick={handleSave}
            className="mt-2 bg-blue-600 text-white transition-transform duration-300 hover:scale-[1.02] hover:bg-blue-700"
          >
            Зберегти
          </Button>
        </div>
      </ModalWindow>
    </>
  )
}