"use client"

import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { FormField } from "@/components/ui/form-field"
import ModalWindow from "@/components/ui/modal-window"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { SubmitButton } from "@/components/ui/submit-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import {
  apiEndpoints,
  routeFormSelectTexts,
  routeStatusLabels,
} from "@/lib/constants"
import {
  createAutoSearchableSelectOptions,
  createDriverSearchableSelectOptions,
  createLocationSearchableSelectOptions,
} from "@/lib/forms/searchable-select-options"
import { Auto, Driver, HttpMethod, Location, RouteStatus } from "@/lib/types"
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

  const locationOptions = createLocationSearchableSelectOptions(locations)

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

  return (
    <>
      <Button
        className="transition hover:bg-gray-700 motion-safe:duration-300 motion-safe:hover:scale-105"
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
              <SearchableSelect
                options={locationOptions}
                selectedValue={routeFormValues.startLocationId}
                onSelectedValueChange={(startLocationId) =>
                  updateRouteFormValues({ startLocationId })
                }
                placeholder={routeFormSelectTexts.startLocationPlaceholder}
                searchPlaceholder={
                  routeFormSelectTexts.locationSearchPlaceholder
                }
                emptyMessage={routeFormSelectTexts.locationEmptyMessage}
              />
            </FormField>
            <FormField label="Кінцева локація">
              <SearchableSelect
                options={locationOptions}
                selectedValue={routeFormValues.destinationLocationId}
                onSelectedValueChange={(destinationLocationId) =>
                  updateRouteFormValues({ destinationLocationId })
                }
                placeholder={
                  routeFormSelectTexts.destinationLocationPlaceholder
                }
                searchPlaceholder={
                  routeFormSelectTexts.locationSearchPlaceholder
                }
                emptyMessage={routeFormSelectTexts.locationEmptyMessage}
              />
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
              <SearchableSelect
                options={createDriverSearchableSelectOptions(drivers)}
                selectedValue={routeFormValues.driverId}
                onSelectedValueChange={(driverId) =>
                  updateRouteFormValues({ driverId })
                }
                placeholder={routeFormSelectTexts.driverPlaceholder}
                searchPlaceholder={routeFormSelectTexts.driverSearchPlaceholder}
                emptyMessage={routeFormSelectTexts.driverEmptyMessage}
              />
            </FormField>
            <FormField label="Автомобіль">
              <SearchableSelect
                options={createAutoSearchableSelectOptions(autos, null)}
                selectedValue={routeFormValues.autoId}
                onSelectedValueChange={(autoId) =>
                  updateRouteFormValues({ autoId })
                }
                placeholder={routeFormSelectTexts.autoPlaceholder}
                searchPlaceholder={routeFormSelectTexts.autoSearchPlaceholder}
                emptyMessage={routeFormSelectTexts.autoEmptyMessage}
              />
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
