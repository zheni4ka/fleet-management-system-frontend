"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
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
  apiEndpoints,
  routeFormFieldNamesByApiPropertyName,
} from "@/lib/constants"
import {
  createCreateRouteRequestModel,
  createEmptyAddRouteFormValues,
  getRouteScheduleFormFieldErrors,
} from "@/lib/forms/route-form"
import {
  AddRouteFormValues,
  AutoLookupOption,
  DriverLookupOption,
  HttpMethod,
  RouteStatus,
} from "@/lib/types"
import { parseEnumValue } from "@/lib/utils"

interface AddRouteModalProps {
  autoLookupOptions: AutoLookupOption[]
  driverLookupOptions: DriverLookupOption[]
}

export default function AddRouteModal({
  autoLookupOptions,
  driverLookupOptions,
}: AddRouteModalProps) {
  const routeStatusTranslations = useTranslations("routeStatus")
  const routeTranslations = useTranslations("routes")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addRouteFormValues, setAddRouteFormValues] = useState(
    createEmptyAddRouteFormValues
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()
  const {
    formFieldErrorMessages,
    showFormFieldErrors,
    showApiFieldErrorMessages,
    clearChangedFormFieldErrorMessages,
    clearFormFieldErrorMessages,
  } = useFormFieldErrorMessages(routeFormFieldNamesByApiPropertyName)

  const handleOpen = () => {
    clearFormFieldErrorMessages()
    setIsModalOpen(true)
  }

  const handleAddRouteFormValuesChange = (
    nextAddRouteFormValues: AddRouteFormValues
  ) => {
    clearChangedFormFieldErrorMessages(
      addRouteFormValues,
      nextAddRouteFormValues
    )
    setAddRouteFormValues(nextAddRouteFormValues)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { startCity, destinationCity } = addRouteFormValues
    const hasFormFieldErrors = showFormFieldErrors(
      getRouteScheduleFormFieldErrors(addRouteFormValues)
    )
    if (hasFormFieldErrors || startCity === null || destinationCity === null) {
      return
    }

    const isRouteCreated = await runApiMutation(
      async () =>
        sendApiRequest(
          apiEndpoints.createRoute,
          HttpMethod.Post,
          createCreateRouteRequestModel(
            addRouteFormValues,
            await resolveRouteLocationIds(startCity, destinationCity)
          )
        ),
      {
        loading: routeTranslations("createLoading"),
        success: routeTranslations("createSuccess"),
        error: routeTranslations("createError"),
      },
      undefined,
      showApiFieldErrorMessages
    )
    if (isRouteCreated) {
      setAddRouteFormValues(createEmptyAddRouteFormValues())
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button hoverEffect="grow" onClick={handleOpen}>
        {routeTranslations("addButtonLabel")}
      </Button>
      <FormModal
        isOpen={isModalOpen}
        title={routeTranslations("addTitle")}
        isSubmitting={isApiMutationRunning}
        submitButtonLabel={commonTranslations("saveButtonLabel")}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <RouteFormFields
          routeFormValues={addRouteFormValues}
          formFieldErrorMessages={formFieldErrorMessages}
          onRouteFormValuesChange={handleAddRouteFormValuesChange}
          autoLookupOptions={autoLookupOptions}
          driverLookupOptions={driverLookupOptions}
          alwaysSelectableAutoId={null}
        />

        <FormSection title={routeTranslations("scheduleSectionTitle")}>
          <RouteTimeFields
            routeFormValues={addRouteFormValues}
            formFieldErrorMessages={formFieldErrorMessages}
            onRouteFormValuesChange={handleAddRouteFormValuesChange}
          />
          <FormField
            label={routeTranslations("statusLabel")}
            isRequired
            errorMessage={formFieldErrorMessages.status}
          >
            <NativeSelect
              value={addRouteFormValues.status}
              onChange={(event) =>
                handleAddRouteFormValuesChange({
                  ...addRouteFormValues,
                  status: parseEnumValue(RouteStatus, event.target.value),
                })
              }
            >
              {Object.values(RouteStatus).map((routeStatus) => (
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
