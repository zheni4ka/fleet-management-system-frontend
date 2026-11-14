"use client"

import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { DriverFormFields } from "@/components/forms/driver-form-fields"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints } from "@/lib/constants"
import {
  createDriverRequestBody,
  createEmptyDriverFormValues,
  getDriverFormValidationError,
} from "@/lib/forms/driver-form"
import { HttpMethod } from "@/lib/types"

export default function AddDriverModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [driverFormValues, setDriverFormValues] = useState(
    createEmptyDriverFormValues
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const driverFormValidationError =
      getDriverFormValidationError(driverFormValues)
    if (driverFormValidationError !== null) {
      toast.error(driverFormValidationError)
      return
    }

    const isDriverCreated = await runApiMutation(
      () =>
        sendApiRequest(
          apiEndpoints.drivers,
          HttpMethod.Post,
          createDriverRequestBody(driverFormValues)
        ),
      {
        loading: "Збереження водія...",
        success: "Водія успішно додано!",
        error: "Помилка при додаванні водія. Спробуйте ще раз.",
      }
    )
    if (isDriverCreated) {
      setDriverFormValues(createEmptyDriverFormValues())
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button
        className="transition hover:bg-gray-700 motion-safe:duration-300 motion-safe:hover:scale-105"
        onClick={() => setIsModalOpen(true)}
      >
        Додати водія
      </Button>
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Додати водія"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <DriverFormFields
            driverFormValues={driverFormValues}
            onDriverFormValuesChange={setDriverFormValues}
          />
          <SubmitButton isSubmitting={isApiMutationRunning}>
            Зберегти
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
