"use client"

import React, { useState } from "react"
import RouteCard from "@/components/route-card"
import GoogleMapRoute from "@/components/google-map-route"
import { Route, Location, RouteStatus } from "@/lib/types" // Додав RouteStatus
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

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

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)

  // Нова функція для зміни статусу
  const handleStatusChange = async (e: React.MouseEvent, route: Route, newStatus: RouteStatus) => {
    e.stopPropagation() // Блокуємо відкриття карти при кліку на кнопку

    const token = getCookie("token")
    if (!token) {
      toast.error("Помилка авторизації. Увійдіть в систему.")
      return
    }

    const updatePromise = fetch(apiBase ? `${apiBase}/api/Route/${route.id}` : `/api/Route/${route.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      // Відправляємо дані згідно з EditRouteModel
      body: JSON.stringify({
        id: route.id,
        startLocationId: route.startLocationId,
        destinationLocationId: route.destinationLocationId,
        autoId: route.autoId,
        driverId: route.driverId,
        status: newStatus
      })
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Помилка сервера")
      }
    })

    toast.promise(updatePromise, {
      loading: "Оновлення статусу...",
      success: "Статус маршруту змінено!",
      error: (err) => err.message || "Не вдалося змінити статус",
    })

    try {
      await updatePromise
      router.refresh() // Оновлюємо сторінку після успіху
    } catch (error) {
      console.error(error)
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {initialRoutes.map((route) => (
          <div
            key={route.id}
            className="cursor-pointer transition-transform hover:scale-[1.01]"
            onClick={() => setSelectedRoute(route)}
          >
            <RouteCard
              startLocationName={locationMap.get(route.startLocationId)}
              destinationLocationName={locationMap.get(
                route.destinationLocationId
              )}
              departureTime={route.departureTime}
              arrivalTime={route.arrivalTime}
              autoId={route.autoId}
              driverId={route.driverId}
              autoName={route.autoId ? autoMap.get(route.autoId) : undefined}
              driverName={route.driverId ? driverMap.get(route.driverId) : undefined}
              status={route.status}
              onStatusChange={(e, newStatus) => handleStatusChange(e, route, newStatus)} // Передаємо функцію
            />
          </div>
        ))}
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