"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import { Pencil } from "lucide-react"
import { IconActionButton } from "@/components/icon-action-button"
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
  createAutoFormValuesFromAuto,
  createUpdateAutoRequestModel,
  getAutoFormFieldErrors,
} from "@/lib/forms/auto-form"
import { Auto, AutoFormValues, Depot, HttpMethod } from "@/lib/types"

interface EditAutoModalProps {
  auto: Auto
  depots: ReadonlyArray<Depot>
}

export default function EditAutoModal({ auto, depots }: EditAutoModalProps) {
  const iconActionTranslations = useTranslations("iconActions")
  const autoTranslations = useTranslations("autos")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [autoFormValues, setAutoFormValues] = useState(() =>
    createAutoFormValuesFromAuto(auto)
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
    setAutoFormValues(createAutoFormValuesFromAuto(auto))
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

    const isAutoUpdated = await runApiMutation(
      () =>
        sendApiRequest(
          apiEndpoints.updateAuto,
          HttpMethod.Put,
          createUpdateAutoRequestModel(auto, autoFormValues)
        ),
      {
        loading: autoTranslations("updateLoading"),
        success: autoTranslations("updateSuccess"),
        error: autoTranslations("updateError"),
      },
      () => setIsModalOpen(false),
      showApiFieldErrorMessages
    )
    if (isAutoUpdated) {
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <IconActionButton
        icon={Pencil}
        label={iconActionTranslations("edit")}
        variant="outline"
        onClick={handleOpen}
      />
      <FormModal
        isOpen={isModalOpen}
        title={autoTranslations("editTitle")}
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
