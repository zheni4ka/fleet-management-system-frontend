"use client"

import { useTranslations } from "next-intl"
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
import { apiEndpoints, depotNameConstraints } from "@/lib/constants"
import { Depot, FormValidationError, HttpMethod } from "@/lib/types"

interface DepotNameModalProps {
  editedDepot: Depot | null
}

export function DepotNameModal({ editedDepot }: DepotNameModalProps) {
  const iconActionTranslations = useTranslations("iconActions")
  const depotTranslations = useTranslations("depots")
  const formValidationTranslations = useTranslations("formValidation")
  const commonTranslations = useTranslations("common")
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
      toast.error(
        formValidationTranslations(FormValidationError.DepotNameMissing)
      )
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
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editedDepot === null
            ? depotTranslations("createTitle")
            : depotTranslations("renameTitle")
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormField label={depotTranslations("nameLabel")}>
            <Input
              required
              maxLength={depotNameConstraints.maxLength}
              value={depotName}
              onChange={(event) => setDepotName(event.target.value)}
            />
          </FormField>
          <SubmitButton isSubmitting={isApiMutationRunning}>
            {commonTranslations("saveButtonLabel")}
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
