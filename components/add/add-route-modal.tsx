"use client"
import { ChangeEvent, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"
import { Auto, Driver, Location } from "@/lib/types"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import e from "express"

const routeStatuses = [
  { value: "Planned", label: "Заплановано" },
  { value: "InProgress", label: "В процесі" },
  { value: "Completed", label: "Виконано" },
  { value: "Cancelled", label: "Скасовано" },
];

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null
  return null
}

export default function AddRouteModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    startLocationId: 0,
    destinationLocationId: 0,
    departureTime: "",
    arrivalTime: "",
    autoId: 0,
    driverId: 0,
    status: 0,
  })

  const apiBase =
    (process.env as { NEXT_PUBLIC_API_BASE_URL?: string })
      .NEXT_PUBLIC_API_BASE_URL ?? ""

  const [drivers, setDrivers] = useState<Driver[]>([])
  const [autos, setAutos] = useState<Auto[]>([])
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    if (!isOpen) return

    const loadRouteDropdowns = async () => {
      const endpoints = [
        { url: `${apiBase}/api/Driver/all`, setter: setDrivers },
        { url: `${apiBase}/api/Auto/all`, setter: setAutos },
        { url: `${apiBase}/api/Location/all`, setter: setLocations },
      ]

      await Promise.all(
        endpoints.map(async ({ url, setter }) => {
          try {
            const res = await fetch(url)
            if (!res.ok) {
              throw new Error(`Failed to load ${url}`)
            }
            setter(await res.json())
          } catch (error) {
            console.error("Error fetching route dropdown data:", error)
          }
        })
      )
    }

    loadRouteDropdowns()
  }, [isOpen, apiBase])

  const handleInputChange =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const handleSelectChange =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: Number(e.target.value) }))
    }

  const handleClear = () => {
    setForm({
      startLocationId: 0,
      destinationLocationId: 0,
      departureTime: "",
      arrivalTime: "",
      autoId: 0,
      driverId: 0,
      status: 0,
    })
  }

  const handleSave = async () => {

    if(!form.startLocationId || !form.destinationLocationId || !form.departureTime || !form.arrivalTime || !form.autoId || !form.driverId) {
      toast.error("Будь ласка, заповніть всі поля форми перед збереженням.")
      return
    }

    const savePromise = POST(apiBase ? `${apiBase}/api/Route` : `/api/Route`);

    toast.promise(savePromise, {
      loading: "Збереження маршруту...",
      success: "Маршрут успішно додано!",
      error: (err) => err.message || "Помилка при додаванні маршруту. Спробуйте ще раз.",
    });

    try {
      await POST(apiBase ? `${apiBase}/api/Route` : `/api/Route`)
      handleClear()
      setIsOpen(false)
      router.refresh() 
    } catch (error) {
      console.error(error)
    }
  }

  async function POST(url: string) {
    const token = getCookie("token")
    if (!token) {
      throw new Error("Токен не знайдено. Будь ласка, увійдіть в систему.")
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        startLocationId: form.startLocationId,
        destinationLocationId: form.destinationLocationId,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        autoId: form.autoId,
        driverId: form.driverId,
        status: form.status,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(
        text ? `Помилка сервера: ${text}` : `Помилка сервера: ${response.status}`
      )
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
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Початкова локація
              </label>
              <select
                value={form.startLocationId || ""}
                onChange={handleSelectChange("startLocationId")}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Оберіть початкову локацію</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.city}, {location.country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Кінцева локація
              </label>
              <select
                value={form.destinationLocationId || ""}
                onChange={handleSelectChange("destinationLocationId")}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Оберіть кінцеву локацію</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.city}, {location.country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Час відправлення
              </label>
              <input
                type="datetime-local"
                value={form.departureTime}
                onChange={handleInputChange("departureTime")}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Час прибуття
              </label>
              <input
                type="datetime-local"
                value={form.arrivalTime}
                onChange={handleInputChange("arrivalTime")}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Водій
              </label>
              <select
                value={form.driverId || ""}
                onChange={handleSelectChange("driverId")}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Оберіть водія</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} {driver.surname}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Автомобіль
              </label>
              <select
                value={form.autoId || ""}
                onChange={handleSelectChange("autoId")}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Оберіть авто</option>
                {autos.map((auto) => (
                  <option key={auto.id} value={auto.id}>
                    {auto.mark} {auto.model} ({auto.number})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус маршруту
              </label>
              <select
                value={form.status}
                onChange={handleSelectChange("status")}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {routeStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
