"use client"

import { useTranslations } from "next-intl"
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
import { apiEndpoints, locationTimeZoneIds } from "@/lib/constants"
import {
  createEmptyLocationFormValues,
  createLocationRequestBody,
  getLocationFormValidationError,
} from "@/lib/forms/location-form"
import { HttpMethod, LocationFormValues } from "@/lib/types"

export default function AddLocationModal() {
  const locationTranslations = useTranslations("locations")
  const timeZoneTranslations = useTranslations("timeZones")
  const formValidationTranslations = useTranslations("formValidation")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [locationFormValues, setLocationFormValues] = useState(
    createEmptyLocationFormValues
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const updateLocationFormValues = (
    changedValues: Partial<LocationFormValues>
  ) => {
    setLocationFormValues({ ...locationFormValues, ...changedValues })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const locationFormValidationError =
      getLocationFormValidationError(locationFormValues)
    if (locationFormValidationError !== null) {
      toast.error(formValidationTranslations(locationFormValidationError))
      return
    }

    const isLocationCreated = await runApiMutation(
      () =>
        sendApiRequest(
          apiEndpoints.createLocation,
          HttpMethod.Post,
          createLocationRequestBody(locationFormValues)
        ),
      {
        loading: locationTranslations("createLoading"),
        success: locationTranslations("createSuccess"),
        error: locationTranslations("createError"),
      }
    )
    if (isLocationCreated) {
      setLocationFormValues(createEmptyLocationFormValues())
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button hoverEffect="grow" onClick={() => setIsModalOpen(true)}>
        {locationTranslations("addButtonLabel")}
      </Button>
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={locationTranslations("addTitle")}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormField label={locationTranslations("cityLabel")}>
            <Input
              value={locationFormValues.city}
              onChange={(event) =>
                updateLocationFormValues({ city: event.target.value })
              }
            />
          </FormField>
          <FormField label={locationTranslations("countryLabel")}>
            <Input
              value={locationFormValues.country}
              onChange={(event) =>
                updateLocationFormValues({ country: event.target.value })
              }
            />
          </FormField>
          <FormField label={locationTranslations("timeZoneLabel")}>
            <NativeSelect
              value={locationFormValues.timeZoneId}
              onChange={(event) =>
                updateLocationFormValues({ timeZoneId: event.target.value })
              }
            >
              <option value="" disabled>
                {locationTranslations("timeZonePlaceholder")}
              </option>
              {locationTimeZoneIds.map((locationTimeZoneId) => (
                <option key={locationTimeZoneId} value={locationTimeZoneId}>
                  {timeZoneTranslations(locationTimeZoneId)}
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
