"use client"
import { useState, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null
  return null
}

export default function AddAutoModal() {
  const base =
    (process.env as { NEXT_PUBLIC_API_BASE_URL?: string })
      .NEXT_PUBLIC_API_BASE_URL ?? ""
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const autoStatuses = [
    { value: "Available", label: "Available" },
    { value: "InService", label: "In Service" },
    { value: "UnderMaintenance", label: "Under Maintenance" },
  ]

  const colors = [
    { label: "Червоний" },
    { label: "Синій" },
    { label: "Зелений" },
    { label: "Чорний" },
    { label: "Білий" },
    { label: "Сірий" },
    { label: "Жовтий" },
  ]

  const [form, setForm] = useState({
    mark: "",
    model: "",
    color: "",
    plate: "",
    capacity: "",
    status: "Available",
  })

  const handleChange =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, status: e.target.value }))
  }

  const handleClear = () => {
    setForm({
      mark: "",
      model: "",
      color: "",
      plate: "",
      capacity: "",
      status: "Available",
    })
  }

  const handleSave = async () => {
    if (
      !form.mark ||
      !form.model ||
      !form.color ||
      !form.plate ||
      !form.capacity
    ) {
      toast.error("Будь ласка, заповніть всі поля форми.")
      return
    }

    const savePromise = POST(base ? `${base}/api/Auto` : `/api/Auto`)

    toast.promise(savePromise, {
      loading: "Збереження автомобіля...",
      success: "Автомобіль успішно додано!",
      error: (err) =>
        err.message || "Помилка при додаванні автомобіля. Спробуйте ще раз.",
    })

    try {
      await savePromise
      handleClear()
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Не вдалося зберегти дані:", error)
    }
  }

  async function POST(url: string) {
    try {
      const token = getCookie("token")
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          mark: form.mark,
          model: form.model,
          color: form.color,
          number: form.plate,
          capacity: parseInt(form.capacity, 10) || 1,
          status: form.status,
        }),
      })

      if (!response.ok) {
        let errorMessage = `Помилка сервера: ${response.status}`
        try {
          const errorData = await response.json()
          if (errorData.detail) errorMessage = errorData.detail
          else if (errorData.title) errorMessage = errorData.title
          else if (errorData.message) errorMessage = errorData.message 
        } catch {
          const text = await response.text()
          if (text) errorMessage = text
        }
        throw new Error(errorMessage)
      }

      const text = await response.text()
      const data = text ? JSON.parse(text) : null
      return data
    } catch (error) {
      console.error("Помилка при додаванні автомобіля:", error)
      throw error
    }
  }

  return (
    <>
      <Button
        className="transition-transform duration-300 hover:scale-105 hover:bg-gray-700"
        onClick={() => setIsOpen(true)}
      >
        Додати автомобіль
      </Button>
      <ModalWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Додати автомобіль"
      >
        <input
          type="text"
          onChange={handleChange("mark")}
          value={form.mark}
          placeholder="Марка"
          className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="text"
          onChange={handleChange("model")}
          value={form.model}
          placeholder="Модель"
          className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={form.color}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, color: e.target.value }))
          }
          className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="" disabled>
            Виберіть колір
          </option>
          {colors.map((color) => (
            <option key={color.label} value={color.label}>
              {color.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          onChange={handleChange("plate")}
          value={form.plate}
          placeholder="Номер"
          className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="text"
          onChange={handleChange("capacity")}
          value={form.capacity}
          placeholder="Місткість(кг)"
          className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={form.status}
          onChange={handleSelectChange}
          className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {autoStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <Button
          className="mt-4 bg-blue-600 text-white transition-transform duration-300 hover:scale-105 hover:bg-blue-700"
          onClick={handleSave}
        >
          Зберегти
        </Button>
      </ModalWindow>
    </>
  )
}
