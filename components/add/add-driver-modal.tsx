"use client"
import { useState } from "react"
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

export default function AddDriverModal() {
  const base = (process.env as { NEXT_PUBLIC_API_BASE_URL?: string }).NEXT_PUBLIC_API_BASE_URL ?? "";
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    surname: "",
    patronymic: "",
    licenseNumber: "",
  })

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

    const savePromise = POST(base ? `${base}/api/Driver` : `/api/Driver`);
    
    toast.promise(savePromise, {
      loading: "Збереження водія...",
      success: "Водій успішно додано!",
      error: (err) => err.message || "Помилка при додаванні водія. Спробуйте ще раз.",
    });

    try {
      await savePromise; 
      handleClear();     
      setIsOpen(false);  
      router.refresh();
    } catch (error) {
      console.error("Не вдалося зберегти дані:", error);
    }
  }

async function POST(url: string) {
  try {
    const token = getCookie("token")
    const response = await fetch(url, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
      body: JSON.stringify({
        name: form.name,
        surname: form.surname,
        patronymic: form.patronymic,
        licenseNumber: form.licenseNumber
      }),
    });

    if (!response.ok) {
      throw new Error(`Помилка сервера: ${response.status} ${response.statusText}`);
    }
    const text = await response.text(); 
    const data = text ? JSON.parse(text) : null; 
    return data;
  } catch (error) {
    console.error("Не вдалося зберегти дані:", error);
    throw error;
}
}

  return (
    <>
      <Button
        className="transition-transform duration-300 hover:scale-105 hover:bg-gray-700"
        onClick={() => setIsOpen(true)}
      >
        Додати водія
      </Button>

      <ModalWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Додати водія"
      >
          
        <input
          type="text"
          value={form.name}
          onChange={handleChange("name")}
          placeholder="Ім'я"
          className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <input
          type="text"
          value={form.surname}
          onChange={handleChange("surname")}
          placeholder="Прізвище"
          className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <input
          type="text"
          value={form.patronymic}
          onChange={handleChange("patronymic")}
          placeholder="По батькові"
          className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <input
          type="text"
          value={form.licenseNumber}
          onChange={handleChange("licenseNumber")}
          placeholder="Посвідчення водія"
          className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <Button
          className="mt-4 bg-blue-600 align-bottom text-white transition-transform duration-300 hover:scale-105 hover:bg-blue-700"
          onClick={handleSave}
        >
          Зберегти
        </Button>
      </ModalWindow>
    </>
  )
}
