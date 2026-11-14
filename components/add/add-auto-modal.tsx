"use client"

import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { AutoFormFields } from "@/components/forms/auto-form-fields"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints } from "@/lib/constants"
import {
  createAutoRequestBody,
  createEmptyAutoFormValues,
  getAutoFormValidationError,
} from "@/lib/forms/auto-form"
import { HttpMethod } from "@/lib/types"

export default function AddAutoModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [autoFormValues, setAutoFormValues] = useState(
    createEmptyAutoFormValues
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const autoFormValidationError = getAutoFormValidationError(autoFormValues)
    if (autoFormValidationError !== null) {
      toast.error(autoFormValidationError)
      return
    }

    const isAutoCreated = await runApiMutation(
      () =>
        sendApiRequest(
          apiEndpoints.autos,
          HttpMethod.Post,
          createAutoRequestBody(autoFormValues)
        ),
      {
        loading: "Збереження автомобіля...",
        success: "Автомобіль успішно додано!",
        error: "Помилка при додаванні автомобіля. Спробуйте ще раз.",
      }
    )
    if (isAutoCreated) {
      setAutoFormValues(createEmptyAutoFormValues())
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button hoverEffect="grow" onClick={() => setIsModalOpen(true)}>
        Додати автомобіль
      </Button>
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Додати автомобіль"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <AutoFormFields
            autoFormValues={autoFormValues}
            onAutoFormValuesChange={setAutoFormValues}
          />
          <SubmitButton isSubmitting={isApiMutationRunning}>
            Зберегти
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
