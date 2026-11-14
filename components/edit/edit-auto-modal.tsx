"use client"

import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Pencil } from "lucide-react"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { TableRowActionButton } from "@/components/tables/table-row-action-button"
import { AutoFormFields } from "@/components/forms/auto-form-fields"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints, tableRowActionLabels } from "@/lib/constants"
import {
  createAutoFormValuesFromAuto,
  createAutoRequestBody,
  getAutoFormValidationError,
} from "@/lib/forms/auto-form"
import { Auto, HttpMethod } from "@/lib/types"

interface EditAutoModalProps {
  auto: Auto
}

export default function EditAutoModal({ auto }: EditAutoModalProps) {
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
      toast.error(autoFormValidationError)
      return
    }

    const isAutoUpdated = await runApiMutation(
      () =>
        sendApiRequest(apiEndpoints.autos, HttpMethod.Put, {
          id: auto.id,
          ...createAutoRequestBody(autoFormValues),
        }),
      {
        loading: "Збереження змін...",
        success: "Автомобіль успішно оновлено!",
        error: "Не вдалося оновити автомобіль",
      }
    )
    if (isAutoUpdated) {
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <TableRowActionButton
        icon={Pencil}
        label={tableRowActionLabels.edit}
        variant="outline"
        onClick={handleOpen}
      />
      <ModalWindow
        title="Редагувати автомобіль"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <AutoFormFields
            autoFormValues={autoFormValues}
            onAutoFormValuesChange={setAutoFormValues}
          />
          <SubmitButton isSubmitting={isApiMutationRunning}>
            Зберегти
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
