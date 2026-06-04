"use client" // Обов'язково вказуємо, що це клієнтський компонент

import React, { useState } from "react"
import RouteCard from "@/components/route-card"
import GoogleMapRoute from "@/components/google-map-route"
import { Route, Location } from "@/lib/types"

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
  // Відновлюємо Map з переданих масивів даних
  const autoMap = new Map(autoMapData)
  const driverMap = new Map(driverMapData)

  const locationMap = new Map<number, string>()
  locations.forEach((loc) =>
    locationMap.set(loc.id, `${loc.city}, ${loc.country}`)
  )

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)

  // Знаходимо повні об'єкти локацій для передачі в GoogleMapRoute
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
            onClick={() => setSelectedRoute(route)} // За кліком на будь-яку картку відкриваємо карту
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
              driverName={
                route.driverId ? driverMap.get(route.driverId) : undefined
              }
              status={route.status}
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
