"use client"

import { useState } from "react"
import { KeyRound } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { IconActionButton } from "@/components/icon-action-button"
import ModalWindow from "@/components/ui/modal-window"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequestForData } from "@/lib/api-client"
import { apiEndpoints, iconActionLabels } from "@/lib/constants"
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
          { userId },
          resetUserPasswordResponseSchema
        )
        setTemporaryPassword(resetUserPasswordResponse.temporaryPassword)
      },
      {
        loading: "Скидання пароля...",
        success: "Пароль скинуто.",
        error: "Не вдалося скинути пароль",
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
        label={iconActionLabels.resetPassword}
        variant="warning"
        onClick={() => setIsResetConfirmationOpen(true)}
        disabled={isApiMutationRunning}
      />
      <ConfirmationDialog
        isOpen={isResetConfirmationOpen}
        title="Скидання пароля"
        message={`Скинути пароль користувача ${username}? Усі його сесії буде завершено, а під час наступного входу потрібно буде змінити тимчасовий пароль.`}
        confirmLabel="Скинути"
        confirmingLabel="Скидання..."
        isConfirming={isApiMutationRunning}
        onConfirm={confirmPasswordReset}
        onCancel={() => setIsResetConfirmationOpen(false)}
      />
      <ModalWindow
        isOpen={temporaryPassword !== null}
        onClose={() => setTemporaryPassword(null)}
        title="Тимчасовий пароль"
      >
        <div className="flex flex-col gap-3 text-sm text-slate-700">
          <p>
            Передайте цей пароль користувачу {username} захищеним каналом.
            Пароль показано лише один раз.
          </p>
          <code className="rounded-md bg-slate-100 px-3 py-2 font-mono text-base select-all">
            {temporaryPassword}
          </code>
        </div>
      </ModalWindow>
    </>
  )
}
