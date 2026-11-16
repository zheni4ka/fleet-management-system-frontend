"use client"

import { useState } from "react"
import { UserCheck, UserX } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { IconActionButton } from "@/components/icon-action-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints, iconActionLabels } from "@/lib/constants"
import { Dispatcher, HttpMethod } from "@/lib/types"

interface UserActivationTableRowActionProps {
  dispatcher: Dispatcher
}

export function UserActivationTableRowAction({
  dispatcher,
}: UserActivationTableRowActionProps) {
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()
  const [isDeactivationConfirmationOpen, setIsDeactivationConfirmationOpen] =
    useState(false)

  if (dispatcher.isDeactivated) {
    return (
      <IconActionButton
        icon={UserCheck}
        label={iconActionLabels.reactivate}
        variant="outline"
        disabled={isApiMutationRunning}
        onClick={() =>
          void runApiMutation(
            () =>
              sendApiRequest(
                `${apiEndpoints.reactivateUser}/${dispatcher.id}`,
                HttpMethod.Post
              ),
            {
              loading: "Активація облікового запису...",
              success: "Обліковий запис активовано!",
              error: "Не вдалося активувати обліковий запис",
            }
          )
        }
      />
    )
  }

  const confirmDeactivation = async () => {
    const isUserDeactivated = await runApiMutation(
      () =>
        sendApiRequest(
          `${apiEndpoints.deactivateUser}/${dispatcher.id}`,
          HttpMethod.Post
        ),
      {
        loading: "Деактивація облікового запису...",
        success: "Обліковий запис деактивовано!",
        error: "Не вдалося деактивувати обліковий запис",
      }
    )
    if (isUserDeactivated) {
      setIsDeactivationConfirmationOpen(false)
    }
  }

  return (
    <>
      <IconActionButton
        icon={UserX}
        label={iconActionLabels.deactivate}
        variant="destructive"
        disabled={isApiMutationRunning}
        onClick={() => setIsDeactivationConfirmationOpen(true)}
      />
      <ConfirmationDialog
        isOpen={isDeactivationConfirmationOpen}
        title="Деактивація облікового запису"
        message={`Деактивувати диспетчера ${dispatcher.username}? Усі його сесії буде завершено, а вхід заблоковано до повторної активації.`}
        confirmLabel="Деактивувати"
        confirmingLabel="Деактивація..."
        isConfirming={isApiMutationRunning}
        onConfirm={confirmDeactivation}
        onCancel={() => setIsDeactivationConfirmationOpen(false)}
      />
    </>
  )
}
