"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import { Pencil } from "lucide-react"
import toast from "react-hot-toast"
import { IconActionButton } from "@/components/icon-action-button"
import { NativeSelect } from "@/components/ui/native-select"
import { FormField } from "@/components/ui/form-field"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { RouteFormFields } from "@/components/forms/route-form-fields"
import { RouteTimeFields } from "@/components/forms/route-time-fields"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { resolveRouteLocationIds } from "@/lib/route-city-locations"
import { allowedRouteStatusTransitions, apiEndpoints } from "@/lib/constants"
import {
  canRouteBeRescheduled,
  createEditRouteFormValuesFromRoute,
  createUpdateRouteRequestModel,
  getEditRouteFormValidationError,
} from "@/lib/forms/edit-route-form"
import { isRouteStatusActive } from "@/lib/route-status"
import {
  AutoLookupOption,
  DriverLookupOption,
  FormValidationError,
  HttpMethod,
  Route,
  RouteStatus,
} from "@/lib/types"
import { parseEnumValue } from "@/lib/utils"

interface EditRouteModalProps {
  route: Route
  autoLookupOptions: AutoLookupOption[]
  driverLookupOptions: DriverLookupOption[]
  isRouteUpdating: boolean
}

export default function EditRouteModal({
  route,
  autoLookupOptions,
  driverLookupOptions,
  isRouteUpdating,
}: EditRouteModalProps) {
  const routeStatusTranslations = useTranslations("routeStatus")
  const iconActionTranslations = useTranslations("iconActions")
  const routeTranslations = useTranslations("routes")
  const formValidationTranslations = useTranslations("formValidation")
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
    const editRouteFormValidationError = getEditRouteFormValidationError(
      route,
      editRouteFormValues
    )
    const { startCity, destinationCity } = editRouteFormValues
    if (
      editRouteFormValidationError !== null ||
      startCity === null ||
      destinationCity === null
    ) {
      toast.error(
        formValidationTranslations(
          editRouteFormValidationError ??
            FormValidationError.RouteRequiredFieldsMissing
        )
      )
      return
    }

    const isRouteUpdated = await runApiMutation(
      async () =>
        sendApiRequest(
          apiEndpoints.updateRoute,
          HttpMethod.Put,
          createUpdateRouteRequestModel(
            route,
            editRouteFormValues,
            await resolveRouteLocationIds(startCity, destinationCity)
          )
        ),
      {
        loading: routeTranslations("updateLoading"),
        success: routeTranslations("updateSuccess"),
        error: routeTranslations("updateError"),
      },
      () => setIsModalOpen(false)
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
        label={iconActionTranslations("edit")}
        variant="outline"
        disabled={isRouteUpdating}
        onClick={handleOpen}
      />
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={routeTranslations("editTitle", { routeId: route.id })}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <RouteFormFields
            routeFormValues={editRouteFormValues}
            onRouteFormValuesChange={setEditRouteFormValues}
            autoLookupOptions={autoLookupOptions}
            driverLookupOptions={driverLookupOptions}
            alwaysSelectableAutoId={route.autoId}
          />

          <FormField label={routeTranslations("statusLabel")}>
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
                  {routeStatusTranslations(routeStatus)}
                </option>
              ))}
            </NativeSelect>
          </FormField>

          {canRouteBeRescheduled(route) ? (
            <RouteTimeFields
              routeFormValues={editRouteFormValues}
              onRouteFormValuesChange={setEditRouteFormValues}
            />
          ) : (
            <p className="text-xs text-slate-500">
              {routeTranslations("timesNotEditableHint")}
            </p>
          )}

          <SubmitButton isSubmitting={isApiMutationRunning}>
            {routeTranslations("saveChangesButtonLabel")}
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
