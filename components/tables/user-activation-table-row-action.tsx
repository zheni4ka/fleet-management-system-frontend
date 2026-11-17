"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { UserCheck, UserX } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { IconActionButton } from "@/components/icon-action-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints } from "@/lib/constants"
import { Dispatcher, HttpMethod } from "@/lib/types"

interface UserActivationTableRowActionProps {
  dispatcher: Dispatcher
}

export function UserActivationTableRowAction({
  dispatcher,
}: UserActivationTableRowActionProps) {
  const iconActionTranslations = useTranslations("iconActions")
  const dispatcherTranslations = useTranslations("dispatchers")
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()
  const [isDeactivationConfirmationOpen, setIsDeactivationConfirmationOpen] =
    useState(false)

  if (dispatcher.isDeactivated) {
    return (
      <IconActionButton
        icon={UserCheck}
        label={iconActionTranslations("reactivate")}
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
              loading: dispatcherTranslations("reactivateLoading"),
              success: dispatcherTranslations("reactivateSuccess"),
              error: dispatcherTranslations("reactivateError"),
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
        loading: dispatcherTranslations("deactivateLoading"),
        success: dispatcherTranslations("deactivateSuccess"),
        error: dispatcherTranslations("deactivateError"),
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
        label={iconActionTranslations("deactivate")}
        variant="destructive"
        disabled={isApiMutationRunning}
        onClick={() => setIsDeactivationConfirmationOpen(true)}
      />
      <ConfirmationDialog
        isOpen={isDeactivationConfirmationOpen}
        title={dispatcherTranslations("deactivateTitle")}
        message={dispatcherTranslations("deactivateQuestion", {
          username: dispatcher.username,
        })}
        confirmLabel={dispatcherTranslations("deactivateConfirmLabel")}
        confirmingLabel={dispatcherTranslations("deactivateConfirmingLabel")}
        isConfirming={isApiMutationRunning}
        onConfirm={confirmDeactivation}
        onCancel={() => setIsDeactivationConfirmationOpen(false)}
      />
    </>
  )
}
