"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { getApiErrorMessage } from "@/lib/api-error-message"
import {
  accountPasswordConstraints,
  bffRoutes,
  commonUiTexts,
  httpContentTypes,
  httpHeaderNames,
  passwordPolicyMessages,
} from "@/lib/constants"
import { getPasswordPolicyViolationMessage } from "@/lib/forms/password-policy"
import { HttpMethod, TemporaryPasswordLogin } from "@/lib/types"

interface ChangeTemporaryPasswordFormProps {
  temporaryPasswordLogin: TemporaryPasswordLogin
  onPasswordChanged: () => void
  onCancel: () => void
}

export function ChangeTemporaryPasswordForm({
  temporaryPasswordLogin,
  onPasswordChanged,
  onCancel,
}: ChangeTemporaryPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("")
  const [passwordChangeErrorMessage, setPasswordChangeErrorMessage] = useState<
    string | null
  >(null)
  const [isPasswordChangeRunning, setIsPasswordChangeRunning] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const passwordPolicyViolationMessage =
      getPasswordPolicyViolationMessage(newPassword)
    if (passwordPolicyViolationMessage !== null) {
      setPasswordChangeErrorMessage(passwordPolicyViolationMessage)
      return
    }
    if (newPassword !== newPasswordConfirmation) {
      setPasswordChangeErrorMessage(passwordPolicyMessages.confirmationMismatch)
      return
    }

    setPasswordChangeErrorMessage(null)
    setIsPasswordChangeRunning(true)
    try {
      const response = await fetch(bffRoutes.sessionChangePassword, {
        method: HttpMethod.Post,
        headers: { [httpHeaderNames.contentType]: httpContentTypes.json },
        body: JSON.stringify({
          username: temporaryPasswordLogin.username,
          currentPassword: temporaryPasswordLogin.temporaryPassword,
          newPassword,
        }),
      })
      if (!response.ok) {
        setPasswordChangeErrorMessage(await getApiErrorMessage(response))
        return
      }
      onPasswordChanged()
    } catch (error) {
      console.error("Помилка під час зміни тимчасового пароля:", error)
      setPasswordChangeErrorMessage(commonUiTexts.serverUnavailableMessage)
    } finally {
      setIsPasswordChangeRunning(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <p className="text-sm text-slate-600">
        Адміністратор скинув ваш пароль. Задайте новий пароль, щоб продовжити.
      </p>
      {passwordChangeErrorMessage !== null && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          ⚠️ {passwordChangeErrorMessage}
        </div>
      )}
      <div className="space-y-4">
        <FormField label="Новий пароль">
          <Input
            type="password"
            required
            autoFocus
            autoComplete="new-password"
            minLength={accountPasswordConstraints.minLength}
            maxLength={accountPasswordConstraints.maxLength}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder={passwordPolicyMessages.hint}
          />
        </FormField>
        <FormField label="Підтвердіть новий пароль">
          <Input
            type="password"
            required
            autoComplete="new-password"
            value={newPasswordConfirmation}
            onChange={(event) => setNewPasswordConfirmation(event.target.value)}
          />
        </FormField>
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isPasswordChangeRunning}
          onClick={onCancel}
          className="flex-1"
        >
          Назад
        </Button>
        <Button
          type="submit"
          disabled={isPasswordChangeRunning}
          variant="accent"
          className="flex-1"
        >
          {isPasswordChangeRunning ? "Збереження..." : "Змінити пароль"}
        </Button>
      </div>
    </form>
  )
}
