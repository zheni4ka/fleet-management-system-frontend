"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Pencil } from "lucide-react"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { IconActionButton } from "@/components/icon-action-button"
import { AutoFormFields } from "@/components/forms/auto-form-fields"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints } from "@/lib/constants"
import {
  createAutoFormValuesFromAuto,
  createUpdateAutoRequestModel,
  getAutoFormValidationError,
} from "@/lib/forms/auto-form"
import { Auto, Depot, HttpMethod } from "@/lib/types"

interface EditAutoModalProps {
  auto: Auto
  depots: ReadonlyArray<Depot>
}

export default function EditAutoModal({ auto, depots }: EditAutoModalProps) {
  const iconActionTranslations = useTranslations("iconActions")
  const autoTranslations = useTranslations("autos")
  const formValidationTranslations = useTranslations("formValidation")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [autoFormValues, setAutoFormValues] = useState(() =>
    createAutoFormValuesFromAuto(auto)
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const handleOpen = () => {
    setAutoFormValues(createAutoFormValuesFromAuto(auto))
    setIsModalOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const autoFormValidationError = getAutoFormValidationError(autoFormValues)
    if (autoFormValidationError !== null) {
      toast.error(formValidationTranslations(autoFormValidationError))
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
      () => setIsModalOpen(false)
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
      <ModalWindow
        title={autoTranslations("editTitle")}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
