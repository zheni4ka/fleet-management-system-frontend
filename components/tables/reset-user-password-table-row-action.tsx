"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { KeyRound } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { IconActionButton } from "@/components/icon-action-button"
import ModalWindow from "@/components/ui/modal-window"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequestForData } from "@/lib/api-client"
import { apiEndpoints } from "@/lib/constants"
import { resetUserPasswordResponseSchema } from "@/lib/schemas/reset-user-password-response-schema"
import { HttpMethod } from "@/lib/types"

interface ResetUserPasswordTableRowActionProps {
  userId: string
  username: string
}

export function ResetUserPasswordTableRowAction({
  userId,
  username,
}: ResetUserPasswordTableRowActionProps) {
  const iconActionTranslations = useTranslations("iconActions")
  const dispatcherTranslations = useTranslations("dispatchers")
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()
  const [isResetConfirmationOpen, setIsResetConfirmationOpen] = useState(false)
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(
    null
  )

  const confirmPasswordReset = async () => {
    const isPasswordReset = await runApiMutation(
      async () => {
        const resetUserPasswordResponse = await sendApiRequestForData(
          apiEndpoints.resetUserPassword,
          HttpMethod.Post,
          resetUserPasswordResponseSchema,
          { userId }
        )
        setTemporaryPassword(resetUserPasswordResponse.temporaryPassword)
      },
      {
        loading: dispatcherTranslations("resetPasswordLoading"),
        success: dispatcherTranslations("resetPasswordSuccess"),
        error: dispatcherTranslations("resetPasswordError"),
      }
    )
    if (isPasswordReset) {
      setIsResetConfirmationOpen(false)
    }
  }

  return (
    <>
      <IconActionButton
        icon={KeyRound}
        label={iconActionTranslations("resetPassword")}
        variant="warning"
        onClick={() => setIsResetConfirmationOpen(true)}
        disabled={isApiMutationRunning}
      />
      <ConfirmationDialog
        isOpen={isResetConfirmationOpen}
        title={dispatcherTranslations("resetPasswordTitle")}
        message={dispatcherTranslations("resetPasswordQuestion", { username })}
        confirmLabel={dispatcherTranslations("resetPasswordConfirmLabel")}
        confirmingLabel={dispatcherTranslations("resetPasswordConfirmingLabel")}
        isConfirming={isApiMutationRunning}
        onConfirm={confirmPasswordReset}
        onCancel={() => setIsResetConfirmationOpen(false)}
      />
      <ModalWindow
        isOpen={temporaryPassword !== null}
        onClose={() => setTemporaryPassword(null)}
        title={dispatcherTranslations("temporaryPasswordTitle")}
      >
        <div className="flex flex-col gap-3 text-sm text-slate-700">
          <p>
            {dispatcherTranslations("temporaryPasswordInstruction", {
              username,
            })}
          </p>
          <code className="rounded-md bg-slate-100 px-3 py-2 font-mono text-base select-all">
            {temporaryPassword}
          </code>
        </div>
      </ModalWindow>
    </>
  )
}
