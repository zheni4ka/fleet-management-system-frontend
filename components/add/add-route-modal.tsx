"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"

export default function AddRouteModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    start: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    autoId: 0,
    driverId: 0,
  })

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleClear = () => {
    setForm({
      start: "",
      destination: "",
      departureTime: "",
      arrivalTime: "",
      autoId: 0,
      driverId: 0,
    })
  }

  const handleSave = async () => {
    
    await POST(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Route`);

    handleClear()
    setIsOpen(false)
  }

async function POST(url: string) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start: form.start,
        destination: form.destination,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        autoId: parseInt(form.autoId.toString(), 10) || 0,
        driverId: parseInt(form.driverId.toString(), 10) || 0,
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
        Додати маршрут
      </Button>
      <ModalWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Додати маршрут"
      >
        <input
          type="text"
          value={form.start}
          onChange={handleChange("start")}
          placeholder="Початок"
          className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <input
          type="text"
          value={form.destination}
          onChange={handleChange("destination")}
          placeholder="Кінець"
          className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <input
          type="datetime-local"
          value={form.departureTime}
          onChange={handleChange("departureTime")}
          placeholder="Час відправлення"
          className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <input
          type="datetime-local"
          value={form.arrivalTime}
          onChange={handleChange("arrivalTime")}
          placeholder="Час прибуття"
          className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <input
          type="number"
          value={form.autoId}
          onChange={handleChange("autoId")}
          placeholder="ID автомобіля"
          className="mt-2 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <input
          type="number"
          value={form.driverId}
          onChange={handleChange("driverId")}
          placeholder="ID водія"
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
