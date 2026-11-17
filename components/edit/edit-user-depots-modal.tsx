"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Building2 } from "lucide-react"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { IconActionButton } from "@/components/icon-action-button"
import { DepotCheckboxList } from "@/components/forms/depot-checkbox-list"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints } from "@/lib/constants"
import { Depot, Dispatcher, FormValidationError, HttpMethod } from "@/lib/types"

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
  const formValidationTranslations = useTranslations("formValidation")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDepotIds, setSelectedDepotIds] = useState<
    ReadonlyArray<number>
  >(dispatcher.depotIds)
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const handleOpen = () => {
    setSelectedDepotIds(dispatcher.depotIds)
    setIsModalOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (selectedDepotIds.length === 0) {
      toast.error(
        formValidationTranslations(FormValidationError.DispatcherDepotsMissing)
      )
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
      }
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
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={dispatcherTranslations("depotsTitle", {
          username: dispatcher.username,
        })}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <DepotCheckboxList
            depots={depots}
            selectedDepotIds={selectedDepotIds}
            onSelectedDepotIdsChange={setSelectedDepotIds}
          />
          <SubmitButton isSubmitting={isApiMutationRunning}>
            {commonTranslations("saveButtonLabel")}
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
