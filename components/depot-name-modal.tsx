"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { FormModal } from "@/components/forms/form-modal"
import { IconActionButton } from "@/components/icon-action-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { useFormFieldErrorMessages } from "@/hooks/use-form-field-error-messages"
import { sendApiRequest } from "@/lib/api-client"
import {
  apiEndpoints,
  depotFormFieldNamesByApiPropertyName,
  depotNameConstraints,
} from "@/lib/constants"
import {
  Depot,
  FormValidationError,
  HttpMethod,
  ModalWindowSize,
} from "@/lib/types"

interface DepotNameModalProps {
  editedDepot: Depot | null
}

export function DepotNameModal({ editedDepot }: DepotNameModalProps) {
  const iconActionTranslations = useTranslations("iconActions")
  const depotTranslations = useTranslations("depots")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [depotName, setDepotName] = useState("")
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()
  const {
    formFieldErrorMessages,
    showFormFieldErrors,
    showApiFieldErrorMessages,
    clearFormFieldErrorMessages,
  } = useFormFieldErrorMessages(depotFormFieldNamesByApiPropertyName)

  const handleOpen = () => {
    setDepotName(editedDepot === null ? "" : editedDepot.name)
    clearFormFieldErrorMessages()
    setIsModalOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedDepotName = depotName.trim()
    const isDepotNameInvalid = showFormFieldErrors(
      trimmedDepotName === ""
        ? { name: FormValidationError.DepotNameMissing }
        : {}
    )
    if (isDepotNameInvalid) {
      return
    }

    const isDepotSaved = await runApiMutation(
      () =>
        editedDepot === null
          ? sendApiRequest(apiEndpoints.createDepot, HttpMethod.Post, {
              name: trimmedDepotName,
            })
          : sendApiRequest(apiEndpoints.updateDepot, HttpMethod.Put, {
              id: editedDepot.id,
              name: trimmedDepotName,
            }),
      {
        loading: depotTranslations("saveLoading"),
        success:
          editedDepot === null
            ? depotTranslations("createSuccess")
            : depotTranslations("renameSuccess"),
        error: depotTranslations("saveError"),
      },
      undefined,
      showApiFieldErrorMessages
    )
    if (isDepotSaved) {
      setIsModalOpen(false)
    }
  }

  return (
    <>
      {editedDepot === null ? (
        <Button variant="accent" onClick={handleOpen}>
          {depotTranslations("addButtonLabel")}
        </Button>
      ) : (
        <IconActionButton
          icon={Pencil}
          label={iconActionTranslations("edit")}
          variant="outline"
          onClick={handleOpen}
        />
      )}
      <FormModal
        isOpen={isModalOpen}
        size={ModalWindowSize.Default}
        title={
          editedDepot === null
            ? depotTranslations("createTitle")
            : depotTranslations("renameTitle")
        }
        isSubmitting={isApiMutationRunning}
        submitButtonLabel={commonTranslations("saveButtonLabel")}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <FormField
          label={depotTranslations("nameLabel")}
          isRequired
          errorMessage={formFieldErrorMessages.name}
        >
          <Input
            maxLength={depotNameConstraints.maxLength}
            value={depotName}
            onChange={(event) => {
              setDepotName(event.target.value)
              clearFormFieldErrorMessages()
            }}
          />
        </FormField>
      </FormModal>
    </>
  )
}
