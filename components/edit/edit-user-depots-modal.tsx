"use client"

import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Building2 } from "lucide-react"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { IconActionButton } from "@/components/icon-action-button"
import { DepotCheckboxList } from "@/components/forms/depot-checkbox-list"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import {
  apiEndpoints,
  iconActionLabels,
  userDepotsFormMessages,
} from "@/lib/constants"
import { Depot, Dispatcher, HttpMethod } from "@/lib/types"

interface EditUserDepotsModalProps {
  dispatcher: Dispatcher
  depots: ReadonlyArray<Depot>
}

export function EditUserDepotsModal({
  dispatcher,
  depots,
}: EditUserDepotsModalProps) {
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
      toast.error(userDepotsFormMessages.depotsRequired)
      return
    }

    const isUserDepotsUpdated = await runApiMutation(
      () =>
        sendApiRequest(apiEndpoints.updateUserDepots, HttpMethod.Put, {
          userId: dispatcher.id,
          depotIds: selectedDepotIds,
        }),
      {
        loading: "Збереження депо...",
        success: userDepotsFormMessages.depotsUpdated,
        error: "Не вдалося змінити депо диспетчера",
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
        label={iconActionLabels.editDepots}
        variant="outline"
        onClick={handleOpen}
      />
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Депо диспетчера ${dispatcher.username}`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <DepotCheckboxList
            depots={depots}
            selectedDepotIds={selectedDepotIds}
            onSelectedDepotIdsChange={setSelectedDepotIds}
          />
          <SubmitButton isSubmitting={isApiMutationRunning}>
            Зберегти
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
