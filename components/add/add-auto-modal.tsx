"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { FormModal } from "@/components/forms/form-modal"
import { FormSection } from "@/components/forms/form-section"
import { AutoFormFields } from "@/components/forms/auto-form-fields"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { useFormFieldErrorMessages } from "@/hooks/use-form-field-error-messages"
import { sendApiRequest } from "@/lib/api-client"
import {
  apiEndpoints,
  autoFormFieldNamesByApiPropertyName,
} from "@/lib/constants"
import {
  createCreateAutoRequestModel,
  createEmptyAutoFormValues,
  getAutoFormFieldErrors,
} from "@/lib/forms/auto-form"
import { AutoFormValues, Depot, HttpMethod } from "@/lib/types"

interface AddAutoModalProps {
  depots: ReadonlyArray<Depot>
}

export default function AddAutoModal({ depots }: AddAutoModalProps) {
  const autoTranslations = useTranslations("autos")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [autoFormValues, setAutoFormValues] = useState(
    createEmptyAutoFormValues
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()
  const {
    formFieldErrorMessages,
    showFormFieldErrors,
    showApiFieldErrorMessages,
    clearChangedFormFieldErrorMessages,
    clearFormFieldErrorMessages,
  } = useFormFieldErrorMessages(autoFormFieldNamesByApiPropertyName)

  const handleOpen = () => {
    clearFormFieldErrorMessages()
    setIsModalOpen(true)
  }

  const handleAutoFormValuesChange = (nextAutoFormValues: AutoFormValues) => {
    clearChangedFormFieldErrorMessages(autoFormValues, nextAutoFormValues)
    setAutoFormValues(nextAutoFormValues)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (showFormFieldErrors(getAutoFormFieldErrors(autoFormValues))) {
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
      },
      undefined,
      showApiFieldErrorMessages
    )
    if (isAutoCreated) {
      setAutoFormValues(createEmptyAutoFormValues())
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button hoverEffect="grow" onClick={handleOpen}>
        {autoTranslations("addButtonLabel")}
      </Button>
      <FormModal
        isOpen={isModalOpen}
        title={autoTranslations("addTitle")}
        isSubmitting={isApiMutationRunning}
        submitButtonLabel={commonTranslations("saveButtonLabel")}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <FormSection title={autoTranslations("detailsSectionTitle")}>
          <AutoFormFields
            depots={depots}
            autoFormValues={autoFormValues}
            formFieldErrorMessages={formFieldErrorMessages}
            onAutoFormValuesChange={handleAutoFormValuesChange}
          />
        </FormSection>
      </FormModal>
    </>
  )
}
