"use client"

import { useState, type FormEvent } from "react"
import { Pencil } from "lucide-react"
import toast from "react-hot-toast"
import { IconActionButton } from "@/components/icon-action-button"
import { NativeSelect } from "@/components/ui/native-select"
import { FormField } from "@/components/ui/form-field"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { RouteFormFields } from "@/components/forms/route-form-fields"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import {
  allowedRouteStatusTransitions,
  apiEndpoints,
  iconActionLabels,
  routeStatusLabels,
} from "@/lib/constants"
import {
  createEditRouteFormValuesFromRoute,
  createUpdateRouteRequestModel,
} from "@/lib/forms/edit-route-form"
import { getRouteAssignmentFormValidationError } from "@/lib/forms/route-form"
import { isRouteStatusActive } from "@/lib/route-status"
import {
  AutoLookupOption,
  DriverLookupOption,
  HttpMethod,
  LocationLookupOption,
  Route,
  RouteStatus,
} from "@/lib/types"
import { parseEnumValue } from "@/lib/utils"

interface EditRouteModalProps {
  route: Route
  autoLookupOptions: AutoLookupOption[]
  driverLookupOptions: DriverLookupOption[]
  locationLookupOptions: LocationLookupOption[]
  isRouteUpdating: boolean
}

export default function EditRouteModal({
  route,
  autoLookupOptions,
  driverLookupOptions,
  locationLookupOptions,
  isRouteUpdating,
}: EditRouteModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editRouteFormValues, setEditRouteFormValues] = useState(() =>
    createEditRouteFormValuesFromRoute(route)
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const isRouteEditable = isRouteStatusActive(route.status)
  const selectableRouteStatuses = [
    route.status,
    ...allowedRouteStatusTransitions[route.status],
  ]

  const handleOpen = () => {
    setEditRouteFormValues(createEditRouteFormValuesFromRoute(route))
    setIsModalOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const routeAssignmentFormValidationError =
      getRouteAssignmentFormValidationError(editRouteFormValues)
    if (routeAssignmentFormValidationError !== null) {
      toast.error(routeAssignmentFormValidationError)
      return
    }

    const isRouteUpdated = await runApiMutation(
      () =>
        sendApiRequest(
          apiEndpoints.updateRoute,
          HttpMethod.Put,
          createUpdateRouteRequestModel(route.id, editRouteFormValues)
        ),
      {
        loading: "Збереження змін маршруту...",
        success: "Маршрут успішно оновлено!",
        error: "Не вдалося оновити маршрут",
      }
    )
    if (isRouteUpdated) {
      setIsModalOpen(false)
    }
  }

  if (!isRouteEditable) {
    return null
  }

  return (
    <>
      <IconActionButton
        icon={Pencil}
        label={iconActionLabels.edit}
        variant="outline"
        disabled={isRouteUpdating}
        onClick={handleOpen}
      />
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Редагувати маршрут #${route.id}`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <RouteFormFields
            routeFormValues={editRouteFormValues}
            onRouteFormValuesChange={setEditRouteFormValues}
            autoLookupOptions={autoLookupOptions}
            driverLookupOptions={driverLookupOptions}
            locationLookupOptions={locationLookupOptions}
            alwaysSelectableAutoId={route.autoId}
          />

          <FormField label="Статус маршруту">
            <NativeSelect
              value={editRouteFormValues.status}
              onChange={(event) =>
                setEditRouteFormValues({
                  ...editRouteFormValues,
                  status: parseEnumValue(RouteStatus, event.target.value),
                })
              }
            >
              {selectableRouteStatuses.map((routeStatus) => (
                <option key={routeStatus} value={routeStatus}>
                  {routeStatusLabels[routeStatus]}
                </option>
              ))}
            </NativeSelect>
          </FormField>

          <p className="text-xs text-slate-500">
            Час відправлення та прибуття після створення маршруту не змінюється.
          </p>

          <SubmitButton isSubmitting={isApiMutationRunning}>
            Зберегти зміни
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
