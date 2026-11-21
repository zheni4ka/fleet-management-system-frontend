"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { NativeSelect } from "@/components/ui/native-select"
import { FormField } from "@/components/ui/form-field"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { RouteFormFields } from "@/components/forms/route-form-fields"
import { RouteTimeFields } from "@/components/forms/route-time-fields"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { resolveRouteLocationIds } from "@/lib/route-city-locations"
import { apiEndpoints } from "@/lib/constants"
import {
  createCreateRouteRequestModel,
  createEmptyAddRouteFormValues,
  getRouteScheduleFormValidationError,
} from "@/lib/forms/route-form"
import {
  AddRouteFormValues,
  AutoLookupOption,
  DriverLookupOption,
  FormValidationError,
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
  const formValidationTranslations = useTranslations("formValidation")
  const commonTranslations = useTranslations("common")
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
    const routeScheduleFormValidationError =
      getRouteScheduleFormValidationError(addRouteFormValues)
    const { startCity, destinationCity } = addRouteFormValues
    if (
      routeScheduleFormValidationError !== null ||
      startCity === null ||
      destinationCity === null
    ) {
      toast.error(
        formValidationTranslations(
          routeScheduleFormValidationError ??
            FormValidationError.RouteRequiredFieldsMissing
        )
      )
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
        {routeTranslations("addButtonLabel")}
      </Button>
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={routeTranslations("addTitle")}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <RouteFormFields
            routeFormValues={addRouteFormValues}
            onRouteFormValuesChange={setAddRouteFormValues}
            autoLookupOptions={autoLookupOptions}
            driverLookupOptions={driverLookupOptions}
            alwaysSelectableAutoId={null}
          />

          <RouteTimeFields
            routeFormValues={addRouteFormValues}
            onRouteFormValuesChange={setAddRouteFormValues}
          />

          <FormField label={routeTranslations("statusLabel")}>
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
                  {routeStatusTranslations(routeStatus)}
                </option>
              ))}
            </NativeSelect>
          </FormField>

          <SubmitButton isSubmitting={isApiMutationRunning}>
            {commonTranslations("saveButtonLabel")}
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
