"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import { Pencil } from "lucide-react"
import { IconActionButton } from "@/components/icon-action-button"
import { NativeSelect } from "@/components/ui/native-select"
import { FormField } from "@/components/ui/form-field"
import { FormModal } from "@/components/forms/form-modal"
import { FormSection } from "@/components/forms/form-section"
import { RouteFormFields } from "@/components/forms/route-form-fields"
import { RouteTimeFields } from "@/components/forms/route-time-fields"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { useFormFieldErrorMessages } from "@/hooks/use-form-field-error-messages"
import { sendApiRequest } from "@/lib/api-client"
import { resolveRouteLocationIds } from "@/lib/route-city-locations"
import {
  allowedRouteStatusTransitions,
  apiEndpoints,
  routeFormFieldNamesByApiPropertyName,
} from "@/lib/constants"
import {
  canRouteBeRescheduled,
  createEditRouteFormValuesFromRoute,
  createUpdateRouteRequestModel,
  getEditRouteFormFieldErrors,
} from "@/lib/forms/edit-route-form"
import { isRouteStatusActive } from "@/lib/route-status"
import {
  AutoLookupOption,
  DriverLookupOption,
  EditRouteFormValues,
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editRouteFormValues, setEditRouteFormValues] = useState(() =>
    createEditRouteFormValuesFromRoute(route)
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()
  const {
    formFieldErrorMessages,
    showFormFieldErrors,
    showApiFieldErrorMessages,
    clearChangedFormFieldErrorMessages,
    clearFormFieldErrorMessages,
  } = useFormFieldErrorMessages(routeFormFieldNamesByApiPropertyName)

  const isRouteEditable = isRouteStatusActive(route.status)
  const selectableRouteStatuses = [
    route.status,
    ...allowedRouteStatusTransitions[route.status],
  ]

  const handleOpen = () => {
    setEditRouteFormValues(createEditRouteFormValuesFromRoute(route))
    clearFormFieldErrorMessages()
    setIsModalOpen(true)
  }

  const handleEditRouteFormValuesChange = (
    nextEditRouteFormValues: EditRouteFormValues
  ) => {
    clearChangedFormFieldErrorMessages(
      editRouteFormValues,
      nextEditRouteFormValues
    )
    setEditRouteFormValues(nextEditRouteFormValues)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { startCity, destinationCity } = editRouteFormValues
    const hasFormFieldErrors = showFormFieldErrors(
      getEditRouteFormFieldErrors(route, editRouteFormValues)
    )
    if (hasFormFieldErrors || startCity === null || destinationCity === null) {
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
      () => setIsModalOpen(false),
      showApiFieldErrorMessages
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
      <FormModal
        isOpen={isModalOpen}
        title={routeTranslations("editTitle", { routeId: route.id })}
        isSubmitting={isApiMutationRunning}
        submitButtonLabel={routeTranslations("saveChangesButtonLabel")}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <RouteFormFields
          routeFormValues={editRouteFormValues}
          formFieldErrorMessages={formFieldErrorMessages}
          onRouteFormValuesChange={handleEditRouteFormValuesChange}
          autoLookupOptions={autoLookupOptions}
          driverLookupOptions={driverLookupOptions}
          alwaysSelectableAutoId={route.autoId}
        />

        <FormSection title={routeTranslations("scheduleSectionTitle")}>
          {canRouteBeRescheduled(route) ? (
            <RouteTimeFields
              routeFormValues={editRouteFormValues}
              formFieldErrorMessages={formFieldErrorMessages}
              onRouteFormValuesChange={handleEditRouteFormValuesChange}
            />
          ) : (
            <p className="text-xs text-slate-500 sm:col-span-2">
              {routeTranslations("timesNotEditableHint")}
            </p>
          )}
          <FormField
            label={routeTranslations("statusLabel")}
            isRequired
            errorMessage={formFieldErrorMessages.status}
          >
            <NativeSelect
              value={editRouteFormValues.status}
              onChange={(event) =>
                handleEditRouteFormValuesChange({
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
        </FormSection>
      </FormModal>
    </>
  )
}
