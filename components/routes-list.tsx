"use client"

import React, { useState, useEffect } from "react"
import RouteCard from "@/components/route-card"
import GoogleMapRoute from "@/components/google-map-route"
import { Route, Location, RouteStatus } from "@/lib/types"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Input } from "./ui/input"

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null
  return null
}

interface RoutesListProps {
  initialRoutes: Route[]
  locations: Location[]
  autoMapData: [number, string][]
  driverMapData: [number, string][]
}

export const RoutesList: React.FC<RoutesListProps> = ({
  initialRoutes,
  locations,
  autoMapData,
  driverMapData,
}) => {
  const router = useRouter()
  const autoMap = new Map(autoMapData)
  const driverMap = new Map(driverMapData)
  const apiBase = (process.env as { NEXT_PUBLIC_API_BASE_URL?: string }).NEXT_PUBLIC_API_BASE_URL ?? ""

  const locationMap = new Map<number, string>()
  locations.forEach((loc) =>
    locationMap.set(loc.id, `${loc.city}, ${loc.country}`)
  )

  const [localRoutes, setLocalRoutes] = useState<Route[]>(initialRoutes)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Фільтрація маршрутів в реальному часі
  const visibleRoutes = localRoutes.filter((route) => {
    const startCity = locationMap.get(route.startLocationId)?.toLowerCase() || ""
    const destCity = locationMap.get(route.destinationLocationId)?.toLowerCase() || ""
    const search = searchQuery.toLowerCase()
    
    // Шукаємо збіги у місті відправлення АБО місті прибуття
    return startCity.includes(search) || destCity.includes(search)
  })

  // Якщо дані з сервера змінилися - оновлюємо локальний стейт
  useEffect(() => {
    setLocalRoutes(initialRoutes)
  }, [initialRoutes])

  // Функція для зміни статусу
  const handleStatusChange = async (e: React.MouseEvent, route: Route, newStatus: RouteStatus) => {
    e.stopPropagation()

    const token = getCookie("token")
    if (!token) {
      toast.error("Помилка авторизації. Увійдіть в систему.")
      return
    }
    setLocalRoutes((prev) => 
      prev.map((r) => (r.id === route.id ? { ...r, status: newStatus } : r))
    )

    const updatePromise = fetch(
      apiBase ? `${apiBase}/api/Route/${route.id}` : `/api/Route/${route.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: route.id,
          startLocationId: route.startLocationId,
          destinationLocationId: route.destinationLocationId,
          autoId: route.autoId,
          driverId: route.driverId,
          status: newStatus,
        }),
      }
    ).then(async (res) => {
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Помилка сервера")
      }
    })

    toast.promise(updatePromise, {
      loading: "Оновлення статусу на сервері...",
      success: "Статус маршруту збережено!",
      error: "Не вдалося зберегти зміни",
    })

    try {
      await updatePromise
      router.refresh()
    } catch (error) {
      setLocalRoutes(initialRoutes)
    }
  }

  const handleDeleteRoute = async (e: React.MouseEvent, routeId: number) => {
    e.stopPropagation()
    const confirmed = window.confirm(
      "Ви впевнені, що хочете безповоротно видалити цей маршрут?"
    )
    if (!confirmed) return

    const token = getCookie("token")
    if (!token) {
      toast.error("Помилка авторизації. Увійдіть в систему.")
      return
    }

    // МИТТЄВЕ ВИДАЛЕННЯ З ІНТЕРФЕЙСУ (Optimistic Update)
    setLocalRoutes((prev) => prev.filter((r) => r.id !== routeId))

    const deletePromise = fetch(
      apiBase ? `${apiBase}/api/Route/${routeId}` : `/api/Route/${routeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then(async (res) => {
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Помилка сервера при видаленні")
      }
    })

    toast.promise(deletePromise, {
      loading: "Видалення на сервері...",
      success: "Маршрут успішно видалено!",
      error: "Не вдалося видалити маршрут",
    })

    try {
      await deletePromise
      if (selectedRoute?.id === routeId) {
        setSelectedRoute(null)
      }
      router.refresh()
    } catch (error) {
       setLocalRoutes(initialRoutes)
    }
  }

  const startLoc = selectedRoute
    ? locations.find((l) => l.id === selectedRoute.startLocationId)
    : null
  const destLoc = selectedRoute
    ? locations.find((l) => l.id === selectedRoute.destinationLocationId)
    : null

  return (
    <>
      {/* 1. ПОШУК ВИРІВНЯНО ТА ВИНЕСЕНО ЗА МЕЖІ СІТКИ (тепер він зверху) */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Пошук за містом відправлення або прибуття..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md bg-white shadow-sm"
        />
      </div>

      {/* 2. СІТКА З КАРТКАМИ */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleRoutes.map((route) => (
          <div key={route.id} onClick={() => setSelectedRoute(route)} className="h-full">
            <RouteCard
              startLocationName={locationMap.get(route.startLocationId)}
              destinationLocationName={locationMap.get(route.destinationLocationId)}
              departureTime={route.departureTime}
              arrivalTime={route.arrivalTime}
              autoId={route.autoId}
              driverId={route.driverId}
              autoName={route.autoId ? autoMap.get(route.autoId) : undefined}
              driverName={route.driverId ? driverMap.get(route.driverId) : undefined}
              status={route.status}
              onStatusChange={(e, newStatus) => handleStatusChange(e, route, newStatus)}
              onDelete={(e) => handleDeleteRoute(e, route.id)}
            />
          </div>
        ))}

        {/* 3. ПОВІДОМЛЕННЯ, ЯКЩО ЗАПИСІВ НЕ ЗНАЙДЕНО */}
        {visibleRoutes.length === 0 && localRoutes.length > 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-dashed rounded-xl">
            За вашим запитом <span className="font-semibold">"{searchQuery}"</span> нічого не знайдено.
          </div>
        )}
      </div>

      {selectedRoute && startLoc && destLoc && (
        <GoogleMapRoute
          origin={`${startLoc.city}, ${startLoc.country}`}
          destination={`${destLoc.city}, ${destLoc.country}`}
          onClose={() => setSelectedRoute(null)}
        />
      )}
    </>
  )
}

export default RoutesList