"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import RouteCard from "@/components/route-card"
import GoogleMapRoute from "@/components/google-map-route"
import EditRouteModal from "@/components/edit/edit-route-modal"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints } from "@/lib/constants"
import {
  createEditRouteFormValuesFromRoute,
  createUpdateRouteRequestModel,
} from "@/lib/forms/edit-route-form"
import {
  formatRouteAutoTitleWithNumber,
  formatRouteDestinationLocationName,
  formatRouteDriverFullName,
  formatRouteStartLocationName,
} from "@/lib/formatters"
import {
  AutoLookupOption,
  DriverLookupOption,
  HttpMethod,
  LocationLookupOption,
  Route,
  RouteStatus,
} from "@/lib/types"

interface RoutesListProps {
  routes: Route[]
  autoLookupOptions: AutoLookupOption[]
  driverLookupOptions: DriverLookupOption[]
  locationLookupOptions: LocationLookupOption[]
  isRoutesListFiltered: boolean
}

export function RoutesList({
  routes,
  autoLookupOptions,
  driverLookupOptions,
  locationLookupOptions,
  isRoutesListFiltered,
}: RoutesListProps) {
  const routeTranslations = useTranslations("routes")
  const commonTranslations = useTranslations("common")
  const [routeStatusOverrides, setRouteStatusOverrides] = useState<
    ReadonlyMap<number, RouteStatus>
  >(() => new Map())
  const [deletedRouteIds, setDeletedRouteIds] = useState<ReadonlySet<number>>(
    () => new Set()
  )
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null)
  const [updatingRouteId, setUpdatingRouteId] = useState<number | null>(null)
  const [routePendingDeletion, setRoutePendingDeletion] =
    useState<Route | null>(null)
  const { runApiMutation } = useApiMutationWithRefresh()

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

  const addDeletedRouteId = (deletedRouteId: number) => {
    setDeletedRouteIds(
      (previousDeletedRouteIds) =>
        new Set([...previousDeletedRouteIds, deletedRouteId])
    )
  }

  const handleStatusChange = async (
    route: Route,
    targetRouteStatus: RouteStatus
  ) => {
    setUpdatingRouteId(route.id)
    updateRouteStatusOverride(route.id, targetRouteStatus)

    const isRouteStatusUpdated = await runApiMutation(
      () =>
        sendApiRequest(
          apiEndpoints.updateRoute,
          HttpMethod.Put,
          createUpdateRouteRequestModel(route, {
            ...createEditRouteFormValuesFromRoute(route),
            status: targetRouteStatus,
          })
        ),
      {
        loading: routeTranslations("statusUpdateLoading"),
        success: routeTranslations("statusUpdateSuccess"),
        error: routeTranslations("statusUpdateError"),
      }
    )
    if (!isRouteStatusUpdated) {
      updateRouteStatusOverride(route.id, null)
    }
    setUpdatingRouteId(null)
  }

  const handleDeleteRouteConfirm = async () => {
    if (routePendingDeletion === null) {
      return
    }
    const deletedRouteId = routePendingDeletion.id
    setUpdatingRouteId(deletedRouteId)

    const isRouteDeleted = await runApiMutation(
      () =>
        sendApiRequest(
          `${apiEndpoints.deleteRoute}/${deletedRouteId}`,
          HttpMethod.Delete
        ),
      {
        loading: routeTranslations("deleteLoading"),
        success: routeTranslations("deleteSuccess"),
        error: routeTranslations("deleteError"),
      }
    )
    if (isRouteDeleted) {
      addDeletedRouteId(deletedRouteId)
      setRoutePendingDeletion(null)
    }
    setUpdatingRouteId(null)
  }

  const selectedRoute = displayedRoutes.find(
    (route) => route.id === selectedRouteId
  )

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayedRoutes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            startLocationName={formatRouteStartLocationName(route)}
            destinationLocationName={formatRouteDestinationLocationName(route)}
            autoTitle={formatRouteAutoTitleWithNumber(route)}
            driverFullName={formatRouteDriverFullName(route)}
            isRouteUpdating={updatingRouteId === route.id}
            editRouteAction={
              <EditRouteModal
                route={route}
                autoLookupOptions={autoLookupOptions}
                driverLookupOptions={driverLookupOptions}
                locationLookupOptions={locationLookupOptions}
                isRouteUpdating={updatingRouteId === route.id}
              />
            }
            onSelect={() => setSelectedRouteId(route.id)}
            onStatusChange={(targetRouteStatus) =>
              handleStatusChange(route, targetRouteStatus)
            }
            onDelete={() => setRoutePendingDeletion(route)}
          />
        ))}

        {displayedRoutes.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed bg-white py-12 text-center text-slate-500">
            {isRoutesListFiltered
              ? commonTranslations("nothingFoundMessage")
              : routeTranslations("emptyList")}
          </div>
        )}
      </div>

      {selectedRoute !== undefined && (
        <GoogleMapRoute
          origin={formatRouteStartLocationName(selectedRoute)}
          destination={formatRouteDestinationLocationName(selectedRoute)}
          onClose={() => setSelectedRouteId(null)}
        />
      )}

      <DeleteConfirmationDialog
        deletionQuestion={
          routePendingDeletion === null
            ? null
            : routeTranslations("deletionQuestion", {
                routeId: routePendingDeletion.id,
                startLocationName:
                  formatRouteStartLocationName(routePendingDeletion),
                destinationLocationName:
                  formatRouteDestinationLocationName(routePendingDeletion),
              })
        }
        isDeleting={updatingRouteId === routePendingDeletion?.id}
        onConfirm={handleDeleteRouteConfirm}
        onCancel={() => setRoutePendingDeletion(null)}
      />
    </>
  )
}

export default RoutesList
