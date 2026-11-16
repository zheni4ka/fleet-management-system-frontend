"use client"

import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { FormField } from "@/components/ui/form-field"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { RouteFormFields } from "@/components/forms/route-form-fields"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints, routeStatusLabels } from "@/lib/constants"
import {
  createCreateRouteRequestModel,
  createEmptyAddRouteFormValues,
  findLocationTimeZoneId,
  getAddRouteFormValidationError,
} from "@/lib/forms/route-form"
import {
  AddRouteFormValues,
  AutoLookupOption,
  DriverLookupOption,
  HttpMethod,
  LocationLookupOption,
  RouteStatus,
} from "@/lib/types"
import { parseEnumValue } from "@/lib/utils"

function createRouteTimeLabel(
  routeTimeLabel: string,
  locationTimeZoneId: string | null
): string {
  return locationTimeZoneId === null
    ? `${routeTimeLabel} (оберіть локацію)`
    : `${routeTimeLabel}, ${locationTimeZoneId}`
}

interface AddRouteModalProps {
  autoLookupOptions: AutoLookupOption[]
  driverLookupOptions: DriverLookupOption[]
  locationLookupOptions: LocationLookupOption[]
}

export default function AddRouteModal({
  autoLookupOptions,
  driverLookupOptions,
  locationLookupOptions,
}: AddRouteModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addRouteFormValues, setAddRouteFormValues] = useState(
    createEmptyAddRouteFormValues
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const updateAddRouteFormValues = (
    changedValues: Partial<AddRouteFormValues>
  ) => {
    setAddRouteFormValues({ ...addRouteFormValues, ...changedValues })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const addRouteFormValidationError = getAddRouteFormValidationError(
      addRouteFormValues,
      locationLookupOptions
    )
    if (addRouteFormValidationError !== null) {
      toast.error(addRouteFormValidationError)
      return
    }

    const isRouteCreated = await runApiMutation(
      () =>
        sendApiRequest(
          apiEndpoints.createRoute,
          HttpMethod.Post,
          createCreateRouteRequestModel(
            addRouteFormValues,
            locationLookupOptions
          )
        ),
      {
        loading: "Збереження маршруту...",
        success: "Маршрут успішно додано!",
        error: "Помилка при додаванні маршруту. Спробуйте ще раз.",
      }
    )
    if (isRouteCreated) {
      setAddRouteFormValues(createEmptyAddRouteFormValues())
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button hoverEffect="grow" onClick={() => setIsModalOpen(true)}>
        Додати маршрут
      </Button>
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Додати маршрут"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <RouteFormFields
            routeFormValues={addRouteFormValues}
            onRouteFormValuesChange={setAddRouteFormValues}
            autoLookupOptions={autoLookupOptions}
            driverLookupOptions={driverLookupOptions}
            locationLookupOptions={locationLookupOptions}
            alwaysSelectableAutoId={null}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              label={createRouteTimeLabel(
                "Час відправлення",
                findLocationTimeZoneId(
                  addRouteFormValues.startLocationId,
                  locationLookupOptions
                )
              )}
            >
              <Input
                type="datetime-local"
                value={addRouteFormValues.departureLocalDateTime}
                onChange={(event) =>
                  updateAddRouteFormValues({
                    departureLocalDateTime: event.target.value,
                  })
                }
              />
            </FormField>
            <FormField
              label={createRouteTimeLabel(
                "Час прибуття",
                findLocationTimeZoneId(
                  addRouteFormValues.destinationLocationId,
                  locationLookupOptions
                )
              )}
            >
              <Input
                type="datetime-local"
                value={addRouteFormValues.arrivalLocalDateTime}
                onChange={(event) =>
                  updateAddRouteFormValues({
                    arrivalLocalDateTime: event.target.value,
                  })
                }
              />
            </FormField>
          </div>

          <FormField label="Статус маршруту">
            <NativeSelect
              value={addRouteFormValues.status}
              onChange={(event) =>
                updateAddRouteFormValues({
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

          <SubmitButton isSubmitting={isApiMutationRunning}>
            Зберегти
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
