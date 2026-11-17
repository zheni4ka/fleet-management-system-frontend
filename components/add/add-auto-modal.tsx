"use client"

import { useTranslations } from "next-intl"
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
  createCreateAutoRequestModel,
  createEmptyAutoFormValues,
  getAutoFormValidationError,
} from "@/lib/forms/auto-form"
import { Depot, HttpMethod } from "@/lib/types"

interface AddAutoModalProps {
  depots: ReadonlyArray<Depot>
}

export default function AddAutoModal({ depots }: AddAutoModalProps) {
  const autoTranslations = useTranslations("autos")
  const formValidationTranslations = useTranslations("formValidation")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [autoFormValues, setAutoFormValues] = useState(
    createEmptyAutoFormValues
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const autoFormValidationError = getAutoFormValidationError(autoFormValues)
    if (autoFormValidationError !== null) {
      toast.error(formValidationTranslations(autoFormValidationError))
      return
    }

    const isAutoCreated = await runApiMutation(
      () =>
        sendApiRequest(
          apiEndpoints.createAuto,
          HttpMethod.Post,
          createCreateAutoRequestModel(autoFormValues)
        ),
      {
        loading: autoTranslations("createLoading"),
        success: autoTranslations("createSuccess"),
        error: autoTranslations("createError"),
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
        {autoTranslations("addButtonLabel")}
      </Button>
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={autoTranslations("addTitle")}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <AutoFormFields
            depots={depots}
            autoFormValues={autoFormValues}
            onAutoFormValuesChange={setAutoFormValues}
          />
          <SubmitButton isSubmitting={isApiMutationRunning}>
            {commonTranslations("saveButtonLabel")}
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
