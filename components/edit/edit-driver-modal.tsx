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

  const handleClear = () => {
    setForm({ name: "", surname: "", patronymic: "", licenseNumber: "" })
  }

  const handleSave = async () => {
    if (!form.name || !form.surname || !form.licenseNumber) {
      toast.error("Будь ласка, заповніть всі поля форми перед збереженням.")
      return
    }

    const savePromise = PUT(`${apiBase ? apiBase : ""}/api/Driver/${driver.id}`)

    toast.promise(savePromise, {
      loading: "Оновлення інформації про водія...",
      success: "Інформацію про водія успішно оновлено.",
      error: "Помилка при оновленні інформації про водія.",
    })

    try {
      await savePromise
      handleClear()
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Не вдалося оновити дані:", error)
    }
  }

  const PUT = async (url: string) => {
    const token = getCookie("token")
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          id: driver.id,
          name: form.name,
          surname: form.surname,
          patronymic: form.patronymic,
          licenseNumber: form.licenseNumber,
        }),
      })

      if (!response.ok) {
        throw new Error(`Помилка сервера: ${response.status}`)
      }
    } catch (error) {
      console.error("Error occurred while updating driver:", error)
      throw error
    }
  }

  return (
    <>
      <Button
        className="transition-transform duration-300 hover:scale-105 hover:bg-gray-700"
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
        <div className="flex w-full flex-col">
          <input
            type="text"
            placeholder="Ім'я"
            value={form.name}
            onChange={handleChange("name")}
            className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Прізвище"
            value={form.surname}
            onChange={handleChange("surname")}
            className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="По-батькові"
            value={form.patronymic}
            onChange={handleChange("patronymic")}
            className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Номер ліцензії"
            value={form.licenseNumber}
            onChange={handleChange("licenseNumber")}
            className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Button
            onClick={handleSave}
            className="mt-4 bg-blue-600 text-white transition-transform duration-300 hover:scale-105 hover:bg-blue-700"
          >
            Зберегти
          </Button>
        </div>
      </ModalWindow>
    </>
  )
}
