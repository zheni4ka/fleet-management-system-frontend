"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import ModalWindow from "@/components/ui/modal-window"
import { DepotCheckboxList } from "@/components/forms/depot-checkbox-list"
import { SubmitButton } from "@/components/ui/submit-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { accountPasswordConstraints, apiEndpoints } from "@/lib/constants"
import { getPasswordPolicyViolation } from "@/lib/forms/password-policy"
import { Depot, FormValidationError, HttpMethod, UserRole } from "@/lib/types"

interface AddDispatcherModalProps {
  depots: ReadonlyArray<Depot>
}

export default function AddDispatcherModal({
  depots,
}: AddDispatcherModalProps) {
  const dispatcherTranslations = useTranslations("dispatchers")
  const passwordPolicyTranslations = useTranslations("passwordPolicy")
  const formValidationTranslations = useTranslations("formValidation")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedDepotIds, setSelectedDepotIds] = useState<
    ReadonlyArray<number>
  >([])
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const passwordPolicyViolation = getPasswordPolicyViolation(password)
    if (passwordPolicyViolation !== null) {
      toast.error(
        passwordPolicyTranslations(passwordPolicyViolation, {
          minLength: accountPasswordConstraints.minLength,
          maxLength: accountPasswordConstraints.maxLength,
        })
      )
      return
    }
    if (selectedDepotIds.length === 0) {
      toast.error(
        formValidationTranslations(FormValidationError.DispatcherDepotsMissing)
      )
      return
    }

    const isDispatcherRegistered = await runApiMutation(
      () =>
        sendApiRequest(apiEndpoints.registerAccount, HttpMethod.Post, {
          username: username.trim(),
          email: email.trim(),
          password,
          role: UserRole.Dispatcher,
          depotIds: selectedDepotIds,
        }),
      {
        loading: dispatcherTranslations("createLoading"),
        success: dispatcherTranslations("createSuccess"),
        error: dispatcherTranslations("createError"),
      }
    )
    if (isDispatcherRegistered) {
      setUsername("")
      setEmail("")
      setPassword("")
      setSelectedDepotIds([])
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button variant="accent" onClick={() => setIsModalOpen(true)}>
        {dispatcherTranslations("addButtonLabel")}
      </Button>
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={dispatcherTranslations("addTitle")}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormField label={dispatcherTranslations("usernameLabel")}>
            <Input
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="dispatcher_1"
            />
          </FormField>
          <FormField label={dispatcherTranslations("emailLabel")}>
            <Input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="disp@fleet.com"
            />
          </FormField>
          <FormField label={dispatcherTranslations("passwordLabel")}>
            <Input
              required
              type="password"
              autoComplete="new-password"
              minLength={accountPasswordConstraints.minLength}
              maxLength={accountPasswordConstraints.maxLength}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={passwordPolicyTranslations("Hint", {
                minLength: accountPasswordConstraints.minLength,
              })}
            />
          </FormField>
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
