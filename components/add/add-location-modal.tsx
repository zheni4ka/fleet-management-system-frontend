"use client"

import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints } from "@/lib/constants"
import {
  createEmptyLocationFormValues,
  createLocationRequestBody,
  getLocationFormValidationError,
} from "@/lib/forms/location-form"
import { HttpMethod, LocationFormValues } from "@/lib/types"

export default function AddLocationModal() {
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
      toast.error(locationFormValidationError)
      return
    }

    const isLocationCreated = await runApiMutation(
      () =>
        sendApiRequest(
          apiEndpoints.locations,
          HttpMethod.Post,
          createLocationRequestBody(locationFormValues)
        ),
      {
        loading: "Збереження локації...",
        success: "Локацію успішно додано!",
        error: "Помилка при додаванні локації. Спробуйте ще раз.",
      }
    )
    if (isLocationCreated) {
      setLocationFormValues(createEmptyLocationFormValues())
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button
        className="transition hover:bg-gray-700 motion-safe:duration-300 motion-safe:hover:scale-105"
        onClick={() => setIsModalOpen(true)}
      >
        Додати локацію
      </Button>
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Додати локацію"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormField label="Місто">
            <Input
              value={locationFormValues.city}
              onChange={(event) =>
                updateLocationFormValues({ city: event.target.value })
              }
            />
          </FormField>
          <FormField label="Країна">
            <Input
              value={locationFormValues.country}
              onChange={(event) =>
                updateLocationFormValues({ country: event.target.value })
              }
            />
          </FormField>
          <SubmitButton isSubmitting={isApiMutationRunning}>
            Зберегти
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
