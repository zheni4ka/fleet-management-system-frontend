"use client"

import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"
import { Auto } from "@/lib/types"
import toast from "react-hot-toast"
import { EditAutoForm } from "@/lib/types"

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
        status: String(auto.status ?? "Available"), // Приводимо до рядка
    })

    const apiBase =
        (process.env as { NEXT_PUBLIC_API_BASE_URL?: string })
            .NEXT_PUBLIC_API_BASE_URL ?? ""

    const handleChange =
        (field: Exclude<keyof EditAutoForm, 'status'>) => (e: ChangeEvent<HTMLInputElement>) => {
            const value = field === 'capacity' ? Number(e.target.value) : e.target.value
            setForm((prev) => ({ ...prev, [field]: value } as EditAutoForm))
        }

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, status: e.target.value }))
    }

    const handleSave = async () => {
        const token = getCookie("token")
        if (!token) {
            toast.error("Помилка авторизації. Увійдіть в систему.")
            return
        }

        const updatePromise = fetch(`${apiBase ? apiBase : ""}/api/Auto`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                id: auto.id,
                mark: form.mark,
                model: form.model,
                color: form.color,
                number: form.licensePlate,
                capacity: Number(form.capacity) || auto.capacity,
                status: form.status, // Відправляємо рядок
            }),
        }).then(async (res) => {
            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || `Помилка сервера: ${res.status}`)
            }
        })

        toast.promise(updatePromise, {
            loading: "Збереження змін...",
            success: "Автомобіль успішно оновлено!",
            error: (err) => err.message || "Не вдалося оновити автомобіль",
        })

        try {
            await updatePromise
            setIsOpen(false)
            router.refresh()
        } catch (error) {
            console.error("Error occurred while updating auto:", error)
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
                        mark: auto.mark,
                        model: auto.model,
                        color: auto.color,
                        licensePlate: auto.number,
                        capacity: auto.capacity,
                        status: String(auto.status ?? "Available"),
                    })
                    setIsOpen(true)
                }}>Редагувати</Button>
            <ModalWindow
                title="Редагувати автомобіль"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <div className="flex flex-col w-full space-y-3">
                    <input
                        type="text"
                        onChange={handleChange("mark")}
                        value={form.mark}
                        placeholder="Марка"
                        className="rounded-md border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <input
                        type="text"
                        onChange={handleChange("model")}
                        value={form.model}
                        placeholder="Модель"
                        className="rounded-md border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <input
                        type="text"
                        onChange={handleChange("color")}
                        value={form.color}
                        placeholder="Колір"
                        className="rounded-md border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <input
                        type="text"
                        onChange={handleChange("licensePlate")}
                        value={form.licensePlate}
                        placeholder="Номерний знак"
                        className="rounded-md border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <input
                        type="number"
                        onChange={handleChange("capacity")}
                        value={form.capacity}
                        placeholder="Місткість(кг)"
                        className="rounded-md border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <select
                        value={form.status}
                        onChange={handleSelectChange}
                        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Available">Доступне</option>
                        <option value="InService">В експлуатації</option>
                        <option value="UnderMaintenance">На техобслуговуванні</option>
                    </select>
                    <Button onClick={handleSave}
                    className="mt-2 bg-blue-600 text-white transition-transform duration-300 hover:scale-[1.02] hover:bg-blue-700">
                        Зберегти
                    </Button>
                </div>
            </ModalWindow>
        </>
    )
}