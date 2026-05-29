import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"
import { Driver } from "@/lib/types"

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
    await PUT(`${apiBase}/api/Driver`)
    handleClear()
    setIsOpen(false)
    router.refresh()
  }

  const PUT = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Ім'я"
            value={form.name}
            onChange={handleChange("name")}
          />
          <input
            type="text"
            placeholder="Прізвище"
            value={form.surname}
            onChange={handleChange("surname")}
          />
          <input
            type="text"
            placeholder="По-батькові"
            value={form.patronymic}
            onChange={handleChange("patronymic")}
          />
          <input
            type="text"
            placeholder="Номер ліцензії"
            value={form.licenseNumber}
            onChange={handleChange("licenseNumber")}
          />
          <Button onClick={handleSave}>Зберегти</Button>
        </div>
      </ModalWindow>
    </>
  )
}
