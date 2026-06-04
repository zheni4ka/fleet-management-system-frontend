import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"
import { Input } from "../ui/input"
import { Auto, type AutoStatus } from "@/lib/types"
import { EditAutoForm } from "@/lib/types"
import toast from "react-hot-toast"

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null
  return null
}

export default function EditAutoModal({ auto }: { auto: Auto }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState<EditAutoForm>({
    mark: auto.mark,
    model: auto.model,
    color: auto.color,
    licensePlate: auto.number,
    capacity: auto.capacity,
    status: auto.status ?? 0,
  })

  const apiBase =
    (process.env as { NEXT_PUBLIC_API_BASE_URL?: string })
      .NEXT_PUBLIC_API_BASE_URL ?? ""

  const handleChange =
    (field: Exclude<keyof EditAutoForm, "status">) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "capacity" ? Number(e.target.value) : e.target.value
      setForm((prev) => ({ ...prev, [field]: value }) as EditAutoForm)
    }

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, status: Number(e.target.value) as number }))
  }

  const handleClear = () => {
    setForm({
      mark: "",
      model: "",
      color: "",
      licensePlate: "",
      capacity: 0,
      status: 0,
    })
  }

  const handleSave = async () => {
    if (
      !form.mark ||
      !form.model ||
      !form.color ||
      !form.licensePlate ||
      form.capacity <= 0
    ) {
      toast.error(
        "Будь ласка, заповніть всі поля форми перед збереженням. Місткість повинна бути більше 0."
      )
      return
    }
    const savePromise = PUT(
      apiBase ? `${apiBase}/api/Auto/${auto.id}` : `/api/Auto/${auto.id}`
    )

    toast.promise(savePromise, {
      loading: "Оновлення інформації про автомобіль...",
      success: "Інформацію про автомобіль успішно оновлено.",
      error: "Помилка при оновленні інформації про автомобіль.",
    })
    try {
      await savePromise
      handleClear()
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("Не вдалося оновити дані:")
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
          id: auto.id,
          mark: form.mark,
          model: form.model,
          color: form.color,
          number: form.licensePlate,
          capacity: Number(form.capacity) || auto.capacity,
          status: form.status,
        }),
      })

      if (!response.ok) {
        throw new Error(`Помилка сервера: ${response.status}`)
      }
    } catch (error) {
      console.error("Error occurred while updating auto:", error)
      throw error
    }
  }

  return (
    <>
      <Button
        className="transition-transform duration-300 hover:scale-105 hover:bg-gray-700"
        onClick={() => {
          setForm({
            mark: auto.mark,
            model: auto.model,
            color: auto.color,
            licensePlate: auto.number,
            capacity: auto.capacity,
            status: auto.status ?? 0,
          })
          setIsOpen(true)
        }}
      >
        Редагувати
      </Button>
      <ModalWindow
        title="Редагувати автомобіль"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="flex w-full flex-col">
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
          <input
            type="text"
            onChange={handleChange("color")}
            value={form.color}
            placeholder="Колір"
            className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            onChange={handleChange("licensePlate")}
            value={form.licensePlate}
            placeholder="Номерний знак"
            className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="number"
            onChange={handleChange("capacity")}
            value={form.capacity}
            placeholder="Місткість(кг)"
            className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <select
            value={form.status}
            onChange={handleSelectChange}
            className="mt-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value={0}>Available</option>
            <option value={1}>In Service</option>
            <option value={2}>Under Maintenance</option>
          </select>
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
