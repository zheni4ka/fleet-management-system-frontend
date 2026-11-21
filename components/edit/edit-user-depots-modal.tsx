"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import { Building2 } from "lucide-react"
import { FormModal } from "@/components/forms/form-modal"
import { IconActionButton } from "@/components/icon-action-button"
import { DepotCheckboxList } from "@/components/forms/depot-checkbox-list"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { useFormFieldErrorMessages } from "@/hooks/use-form-field-error-messages"
import { sendApiRequest } from "@/lib/api-client"
import {
  apiEndpoints,
  userDepotsFormFieldNamesByApiPropertyName,
} from "@/lib/constants"
import {
  Depot,
  Dispatcher,
  FormValidationError,
  HttpMethod,
  ModalWindowSize,
} from "@/lib/types"

interface EditUserDepotsModalProps {
  dispatcher: Dispatcher
  depots: ReadonlyArray<Depot>
}

export function EditUserDepotsModal({
  dispatcher,
  depots,
}: EditUserDepotsModalProps) {
  const iconActionTranslations = useTranslations("iconActions")
  const dispatcherTranslations = useTranslations("dispatchers")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDepotIds, setSelectedDepotIds] = useState<
    ReadonlyArray<number>
  >(dispatcher.depotIds)
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()
  const {
    formFieldErrorMessages,
    showFormFieldErrors,
    showApiFieldErrorMessages,
    clearFormFieldErrorMessages,
  } = useFormFieldErrorMessages(userDepotsFormFieldNamesByApiPropertyName)

  const handleOpen = () => {
    setSelectedDepotIds(dispatcher.depotIds)
    clearFormFieldErrorMessages()
    setIsModalOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isDepotSelectionInvalid = showFormFieldErrors(
      selectedDepotIds.length === 0
        ? { depotIds: FormValidationError.DispatcherDepotsMissing }
        : {}
    )
    if (isDepotSelectionInvalid) {
      return
    }

    const isUserDepotsUpdated = await runApiMutation(
      () =>
        sendApiRequest(apiEndpoints.updateUserDepots, HttpMethod.Put, {
          userId: dispatcher.id,
          depotIds: selectedDepotIds,
        }),
      {
        loading: dispatcherTranslations("depotsUpdateLoading"),
        success: dispatcherTranslations("depotsUpdateSuccess"),
        error: dispatcherTranslations("depotsUpdateError"),
      },
      undefined,
      showApiFieldErrorMessages
    )
    if (isUserDepotsUpdated) {
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <IconActionButton
        icon={Building2}
        label={iconActionTranslations("editDepots")}
        variant="outline"
        onClick={handleOpen}
      />
      <FormModal
        isOpen={isModalOpen}
        size={ModalWindowSize.Default}
        title={dispatcherTranslations("depotsTitle", {
          username: dispatcher.username,
        })}
        isSubmitting={isApiMutationRunning}
        submitButtonLabel={commonTranslations("saveButtonLabel")}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <DepotCheckboxList
          depots={depots}
          selectedDepotIds={selectedDepotIds}
          errorMessage={formFieldErrorMessages.depotIds}
          onSelectedDepotIdsChange={(nextSelectedDepotIds) => {
            setSelectedDepotIds(nextSelectedDepotIds)
            clearFormFieldErrorMessages()
          }}
        />
      </FormModal>
    </>
  )
}
