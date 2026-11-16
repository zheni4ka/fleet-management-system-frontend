"use client"

import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { IconActionButton } from "@/components/icon-action-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import {
  apiEndpoints,
  depotNameConstraints,
  iconActionLabels,
} from "@/lib/constants"
import { Depot, HttpMethod } from "@/lib/types"

interface DepotNameModalProps {
  editedDepot: Depot | null
}

export function DepotNameModal({ editedDepot }: DepotNameModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [depotName, setDepotName] = useState("")
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const handleOpen = () => {
    setDepotName(editedDepot === null ? "" : editedDepot.name)
    setIsModalOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedDepotName = depotName.trim()
    if (trimmedDepotName === "") {
      toast.error(depotNameConstraints.nameRequiredMessage)
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
        loading: "Збереження депо...",
        success:
          editedDepot === null ? "Депо створено!" : "Депо перейменовано!",
        error: "Не вдалося зберегти депо",
      }
    )
    if (isDepotSaved) {
      setIsModalOpen(false)
    }
  }

  return (
    <>
      {editedDepot === null ? (
        <Button variant="accent" onClick={handleOpen}>
          + Додати депо
        </Button>
      ) : (
        <IconActionButton
          icon={Pencil}
          label={iconActionLabels.edit}
          variant="outline"
          onClick={handleOpen}
        />
      )}
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editedDepot === null ? "Нове депо" : "Перейменування депо"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormField label="Назва депо">
            <Input
              required
              maxLength={depotNameConstraints.maxLength}
              value={depotName}
              onChange={(event) => setDepotName(event.target.value)}
            />
          </FormField>
          <SubmitButton isSubmitting={isApiMutationRunning}>
            Зберегти
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
