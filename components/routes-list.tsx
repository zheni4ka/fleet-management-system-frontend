"use client"

import { useMemo, useState } from "react"
import RouteCard from "@/components/route-card"
import GoogleMapRoute from "@/components/google-map-route"
import EditRouteModal from "@/components/edit/edit-route-modal"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import {
  apiEndpoints,
  nothingFoundMessage,
  unknownLocationLabel,
} from "@/lib/constants"
import {
  formatAutoTitleWithNumber,
  formatDriverFullName,
  formatLocationName,
} from "@/lib/formatters"
import {
  Auto,
  Driver,
  HttpMethod,
  Location,
  Route,
  RouteStatus,
} from "@/lib/types"

interface RoutesListProps {
  routes: Route[]
  locations: Location[]
  autos: Auto[]
  drivers: Driver[]
  isRoutesListFiltered: boolean
}

export function RoutesList({
  routes,
  locations,
  autos,
  drivers,
  isRoutesListFiltered,
}: RoutesListProps) {
  const [serverRoutesSnapshot, setServerRoutesSnapshot] = useState(routes)
  const [routeStatusOverrides, setRouteStatusOverrides] = useState<
    ReadonlyMap<number, RouteStatus>
  >(() => new Map())
  const [deletedRouteIds, setDeletedRouteIds] = useState<ReadonlySet<number>>(
    () => new Set()
  )
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null)
  const [updatingRouteId, setUpdatingRouteId] = useState<number | null>(null)
  const { runApiMutation } = useApiMutationWithRefresh()

  if (serverRoutesSnapshot !== routes) {
    setServerRoutesSnapshot(routes)
    setRouteStatusOverrides(new Map())
    setDeletedRouteIds(new Set())
  }

  const locationsById = useMemo(
    () => new Map(locations.map((location) => [location.id, location])),
    [locations]
  )
  const autosById = useMemo(
    () => new Map(autos.map((auto) => [auto.id, auto])),
    [autos]
  )
  const driversById = useMemo(
    () => new Map(drivers.map((driver) => [driver.id, driver])),
    [drivers]
  )

  const displayedRoutes = useMemo(
    () =>
      routes
        .filter((route) => !deletedRouteIds.has(route.id))
        .map((route) => {
          const overriddenRouteStatus = routeStatusOverrides.get(route.id)
          return overriddenRouteStatus === undefined
            ? route
            : { ...route, status: overriddenRouteStatus }
        }),
    [routes, deletedRouteIds, routeStatusOverrides]
  )

  const getLocationName = (locationId: number): string => {
    const location = locationsById.get(locationId)
    return location === undefined
      ? unknownLocationLabel
      : formatLocationName(location)
  }

  const getAutoTitle = (autoId: number): string => {
    const auto = autosById.get(autoId)
    return auto === undefined
      ? `Авто ID: ${autoId}`
      : formatAutoTitleWithNumber(auto)
  }

  const getDriverFullName = (driverId: number): string => {
    const driver = driversById.get(driverId)
    return driver === undefined
      ? `Водій ID: ${driverId}`
      : formatDriverFullName(driver)
  }

  const updateRouteStatusOverride = (
    routeId: number,
    routeStatus: RouteStatus | null
  ) => {
    setRouteStatusOverrides((previousRouteStatusOverrides) => {
      const nextRouteStatusOverrides = new Map(previousRouteStatusOverrides)
      if (routeStatus === null) {
        nextRouteStatusOverrides.delete(routeId)
      } else {
        nextRouteStatusOverrides.set(routeId, routeStatus)
      }
      return nextRouteStatusOverrides
    })
  }

  const updateDeletedRouteIds = (routeId: number, isRouteDeleted: boolean) => {
    setDeletedRouteIds((previousDeletedRouteIds) => {
      const nextDeletedRouteIds = new Set(previousDeletedRouteIds)
      if (isRouteDeleted) {
        nextDeletedRouteIds.add(routeId)
      } else {
        nextDeletedRouteIds.delete(routeId)
      }
      return nextDeletedRouteIds
    })
  }

  const handleStatusChange = async (
    route: Route,
    targetRouteStatus: RouteStatus
  ) => {
    setUpdatingRouteId(route.id)
    updateRouteStatusOverride(route.id, targetRouteStatus)

    const isRouteStatusUpdated = await runApiMutation(
      () =>
        sendApiRequest(`${apiEndpoints.routes}/${route.id}`, HttpMethod.Put, {
          id: route.id,
          startLocationId: route.startLocationId,
          destinationLocationId: route.destinationLocationId,
          departureTime: route.departureTime,
          arrivalTime: route.arrivalTime,
          autoId: route.autoId,
          driverId: route.driverId,
          status: targetRouteStatus,
        }),
      {
        loading: "Оновлення статусу на сервері...",
        success: "Статус маршруту збережено!",
        error: "Не вдалося зберегти зміни",
      }
    )
    if (!isRouteStatusUpdated) {
      updateRouteStatusOverride(route.id, null)
    }
    setUpdatingRouteId(null)
  }

  const handleDeleteRoute = async (routeId: number) => {
    if (
      !window.confirm(
        "Ви впевнені, що хочете безповоротно видалити цей маршрут?"
      )
    ) {
      return
    }

    setUpdatingRouteId(routeId)
    updateDeletedRouteIds(routeId, true)

    const isRouteDeleted = await runApiMutation(
      () =>
        sendApiRequest(`${apiEndpoints.routes}/${routeId}`, HttpMethod.Delete),
      {
        loading: "Видалення на сервері...",
        success: "Маршрут успішно видалено!",
        error: "Не вдалося видалити маршрут",
      }
    )
    if (!isRouteDeleted) {
      updateDeletedRouteIds(routeId, false)
    }
    setUpdatingRouteId(null)
  }

  const selectedRoute = displayedRoutes.find(
    (route) => route.id === selectedRouteId
  )
  const selectedRouteStartLocation =
    selectedRoute && locationsById.get(selectedRoute.startLocationId)
  const selectedRouteDestinationLocation =
    selectedRoute && locationsById.get(selectedRoute.destinationLocationId)

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayedRoutes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            startLocationName={getLocationName(route.startLocationId)}
            destinationLocationName={getLocationName(
              route.destinationLocationId
            )}
            autoTitle={getAutoTitle(route.autoId)}
            driverFullName={getDriverFullName(route.driverId)}
            isRouteUpdating={updatingRouteId === route.id}
            editRouteAction={
              <EditRouteModal
                route={route}
                autos={autos}
                drivers={drivers}
                locations={locations}
                isRouteUpdating={updatingRouteId === route.id}
              />
            }
            onSelect={() => setSelectedRouteId(route.id)}
            onStatusChange={(targetRouteStatus) =>
              handleStatusChange(route, targetRouteStatus)
            }
            onDelete={() => handleDeleteRoute(route.id)}
          />
        ))}

        {displayedRoutes.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed bg-white py-12 text-center text-slate-500">
            {isRoutesListFiltered
              ? nothingFoundMessage
              : "Маршрутів поки немає."}
          </div>
        )}
      </div>

      {selectedRouteStartLocation && selectedRouteDestinationLocation && (
        <GoogleMapRoute
          origin={formatLocationName(selectedRouteStartLocation)}
          destination={formatLocationName(selectedRouteDestinationLocation)}
          onClose={() => setSelectedRouteId(null)}
        />
      )}
    </>
  )
}

export default RoutesList
