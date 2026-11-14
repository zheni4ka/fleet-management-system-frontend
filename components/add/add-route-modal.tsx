"use client"

import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { FormField } from "@/components/ui/form-field"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints, routeStatusLabels } from "@/lib/constants"
import {
  formatAutoTitleWithNumber,
  formatDriverFullName,
  formatLocationName,
} from "@/lib/formatters"
import {
  Auto,
  AutoStatus,
  Driver,
  HttpMethod,
  Location,
  RouteStatus,
} from "@/lib/types"
import { parseEnumValue } from "@/lib/utils"

interface AddRouteModalProps {
  autos: Auto[]
  drivers: Driver[]
  locations: Location[]
}

function createEmptyRouteFormValues() {
  return {
    startLocationId: "",
    destinationLocationId: "",
    departureTime: "",
    arrivalTime: "",
    autoId: "",
    driverId: "",
    status: RouteStatus.Planned,
  }
}

type RouteFormValues = ReturnType<typeof createEmptyRouteFormValues>

function getRouteFormValidationError(
  routeFormValues: RouteFormValues
): string | null {
  const hasEmptyRequiredField = [
    routeFormValues.startLocationId,
    routeFormValues.destinationLocationId,
    routeFormValues.departureTime,
    routeFormValues.arrivalTime,
    routeFormValues.autoId,
    routeFormValues.driverId,
  ].some((requiredFieldValue) => requiredFieldValue === "")
  if (hasEmptyRequiredField) {
    return "Будь ласка, заповніть всі поля форми перед збереженням."
  }
  if (
    routeFormValues.startLocationId === routeFormValues.destinationLocationId
  ) {
    return "Початкова та кінцева локації мають відрізнятися."
  }
  if (
    new Date(routeFormValues.arrivalTime) <=
    new Date(routeFormValues.departureTime)
  ) {
    return "Час прибуття має бути пізніше за час відправлення."
  }
  return null
}

export default function AddRouteModal({
  autos,
  drivers,
  locations,
}: AddRouteModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [routeFormValues, setRouteFormValues] = useState(
    createEmptyRouteFormValues
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const assignableAutos = autos.filter(
    (auto) => auto.status !== AutoStatus.UnderMaintenance
  )

  const updateRouteFormValues = (changedValues: Partial<RouteFormValues>) => {
    setRouteFormValues({ ...routeFormValues, ...changedValues })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const routeFormValidationError =
      getRouteFormValidationError(routeFormValues)
    if (routeFormValidationError !== null) {
      toast.error(routeFormValidationError)
      return
    }

    const isRouteCreated = await runApiMutation(
      () =>
        sendApiRequest(apiEndpoints.routes, HttpMethod.Post, {
          startLocationId: Number(routeFormValues.startLocationId),
          destinationLocationId: Number(routeFormValues.destinationLocationId),
          departureTime: routeFormValues.departureTime,
          arrivalTime: routeFormValues.arrivalTime,
          autoId: Number(routeFormValues.autoId),
          driverId: Number(routeFormValues.driverId),
          status: routeFormValues.status,
        }),
      {
        loading: "Збереження маршруту...",
        success: "Маршрут успішно додано!",
        error: "Помилка при додаванні маршруту. Спробуйте ще раз.",
      }
    )
    if (isRouteCreated) {
      setRouteFormValues(createEmptyRouteFormValues())
      setIsModalOpen(false)
    }
  }

  const renderLocationOptions = () =>
    locations.map((location) => (
      <option key={location.id} value={location.id}>
        {formatLocationName(location)}
      </option>
    ))

  return (
    <>
      <Button
        className="transition-transform duration-300 hover:scale-105 hover:bg-gray-700"
        onClick={() => setIsModalOpen(true)}
      >
        Додати маршрут
      </Button>
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Додати маршрут"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Початкова локація">
              <NativeSelect
                value={routeFormValues.startLocationId}
                onChange={(event) =>
                  updateRouteFormValues({ startLocationId: event.target.value })
                }
              >
                <option value="">Оберіть початкову локацію</option>
                {renderLocationOptions()}
              </NativeSelect>
            </FormField>
            <FormField label="Кінцева локація">
              <NativeSelect
                value={routeFormValues.destinationLocationId}
                onChange={(event) =>
                  updateRouteFormValues({
                    destinationLocationId: event.target.value,
                  })
                }
              >
                <option value="">Оберіть кінцеву локацію</option>
                {renderLocationOptions()}
              </NativeSelect>
            </FormField>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Час відправлення">
              <Input
                type="datetime-local"
                value={routeFormValues.departureTime}
                onChange={(event) =>
                  updateRouteFormValues({ departureTime: event.target.value })
                }
              />
            </FormField>
            <FormField label="Час прибуття">
              <Input
                type="datetime-local"
                value={routeFormValues.arrivalTime}
                onChange={(event) =>
                  updateRouteFormValues({ arrivalTime: event.target.value })
                }
              />
            </FormField>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <FormField label="Водій">
              <NativeSelect
                value={routeFormValues.driverId}
                onChange={(event) =>
                  updateRouteFormValues({ driverId: event.target.value })
                }
              >
                <option value="">Оберіть водія</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {formatDriverFullName(driver)}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField label="Автомобіль">
              <NativeSelect
                value={routeFormValues.autoId}
                onChange={(event) =>
                  updateRouteFormValues({ autoId: event.target.value })
                }
              >
                <option value="">Оберіть авто</option>
                {assignableAutos.map((auto) => (
                  <option key={auto.id} value={auto.id}>
                    {formatAutoTitleWithNumber(auto)}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField label="Статус маршруту">
              <NativeSelect
                value={routeFormValues.status}
                onChange={(event) =>
                  updateRouteFormValues({
                    status: parseEnumValue(RouteStatus, event.target.value),
                  })
                }
              >
                {Object.values(RouteStatus).map((routeStatus) => (
                  <option key={routeStatus} value={routeStatus}>
                    {routeStatusLabels[routeStatus]}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
          </div>

          <SubmitButton isSubmitting={isApiMutationRunning}>
            Зберегти
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
