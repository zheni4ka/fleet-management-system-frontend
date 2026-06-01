import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"
import { Input } from "../ui/input"
import { Auto, type AutoStatus } from "@/lib/types"

interface EditAutoForm {
    mark: string
    model: string
    color: string
    licensePlate: string
    capacity: number
    status: number
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
        (field: Exclude<keyof EditAutoForm, 'status'>) => (e: ChangeEvent<HTMLInputElement>) => {
            const value = field === 'capacity' ? Number(e.target.value) : e.target.value
            setForm((prev) => ({ ...prev, [field]: value } as EditAutoForm))
        }

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, status: Number(e.target.value) as number }))
    }

    const handleClear = () => {
        setForm({ mark: "", model: "", color: "", licensePlate: "", capacity: 0, status: 0 })
    }

    const handleSave = async () => {
        await PUT(`${apiBase}/api/Auto`)
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
                }}>Редагувати</Button>
            <ModalWindow
                title="Редагувати автомобіль"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <div className="flex flex-col w-full">
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
                        className="mt-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={0}>Available</option>
                        <option value={1}>In Service</option>
                        <option value={2}>Under Maintenance</option>
                    </select>
                    <Button onClick={handleSave}
                    className="mt-4 bg-blue-600 text-white transition-transform duration-300 hover:scale-105 hover:bg-blue-700">Зберегти</Button>
                </div>
            </ModalWindow>
        </>
    )
}
