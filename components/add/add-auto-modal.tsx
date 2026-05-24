"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"

export default function AddAutoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    mark: "",
    model: "",
    color: "",
    plate: "",
    capacity: "",
  })

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleClear = () => {
    setForm({ mark: "", model: "", color: "", plate: "", capacity: "" })
  }

  const handleSave = async () => {
    handleClear();
    setIsOpen(false);
    try {
      const base = (process.env as { NEXT_PUBLIC_API_BASE_URL?: string }).NEXT_PUBLIC_API_BASE_URL ?? "";
      const url = base ? `${base}/api/Auto` : `/api/Auto`;
      console.log("Posting auto to:", url);

      await POST(url);

    } catch (error) {
      console.error("Не вдалося зберегти дані:", error);
    }
  };

async function POST(url: string) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mark: form.mark,
        model: form.model,
        color: form.color,
        number: form.plate,
        capacity: parseInt(form.capacity, 10) || 1
      }),
    });

    if (!response.ok) {
      throw new Error(`Помилка сервера: ${response.status} ${response.statusText}`);
    }

    const text = await response.text(); // Читаємо відповідь як чистий текст
    const data = text ? JSON.parse(text) : null; // Парсимо тільки якщо текст не порожній
    return data;

    
  } catch (error) {
    console.error("Помилка при додаванні автомобіля:", error);
    throw error; // Прокидаємо помилку далі, щоб handleSave про неї дізнався
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
        <div className="space-y-3">
          <input
            type="text"
            onChange={handleChange("mark")}
            value={form.mark}
            placeholder="Марка"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            onChange={handleChange("model")}
            value={form.model}
            placeholder="Модель"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            onChange={handleChange("color")}
            value={form.color}
            placeholder="Колір"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            onChange={handleChange("plate")}
            value={form.plate}
            placeholder="Номер"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            onChange={handleChange("capacity")}
            value={form.capacity}
            placeholder="Місткість(кг)"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Button
            className="mt-4 bg-blue-600 text-white transition-transform duration-300 hover:scale-105 hover:bg-blue-700"
            onClick={handleSave}
          >
            Зберегти
          </Button>
        </div>
      </ModalWindow>
    </>
  )
}
