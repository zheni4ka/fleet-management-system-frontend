import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"
import { Auto } from "@/lib/types"


export default function EditAutoModal({ auto }: { auto: Auto }) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [form, setForm] = useState({
        make: auto.mark,
        model: auto.model,
        color: auto.color,
        licensePlate: auto.number,
    })

    const apiBase =
        (process.env as { NEXT_PUBLIC_API_BASE_URL?: string })
            .NEXT_PUBLIC_API_BASE_URL ?? ""

    const handleChange =
        (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }))
        }

    const handleClear = () => {
        setForm({ make: "", model: "", color: "", licensePlate: "" })
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
                    mark: form.make,
                    model: form.model,
                    color: form.color,
                    number: form.licensePlate,
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
                        make: auto.mark,
                        model: auto.model,
                        color: auto.color,
                        licensePlate: auto.number,
                    })
                    setIsOpen(true)
                }}>Редагувати</Button>
            <ModalWindow
                title="Редагувати автомобіль"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <div className="space-y-4">
                    <input
                        type="text"
                        onChange={handleChange("make")}
                        value={form.make}
                        placeholder="Марка"
                    />
                    <input
                        type="text"
                        onChange={handleChange("model")}
                        value={form.model}
                        placeholder="Модель"
                    />
                    <input
                        type="text"
                        onChange={handleChange("color")}
                        value={form.color}
                        placeholder="Колір"
                    />
                    <input
                        type="text"
                        onChange={handleChange("licensePlate")}
                        value={form.licensePlate}
                        placeholder="Номерний знак"
                    />
                    <Button onClick={handleSave}>Зберегти</Button>
                </div>
            </ModalWindow>
        </>
    )
}
