"use client"

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
import {
  accountPasswordConstraints,
  apiEndpoints,
  passwordPolicyMessages,
  userDepotsFormMessages,
} from "@/lib/constants"
import { getPasswordPolicyViolationMessage } from "@/lib/forms/password-policy"
import { Depot, HttpMethod, UserRole } from "@/lib/types"

interface AddDispatcherModalProps {
  depots: ReadonlyArray<Depot>
}

export default function AddDispatcherModal({
  depots,
}: AddDispatcherModalProps) {
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

    const passwordPolicyViolationMessage =
      getPasswordPolicyViolationMessage(password)
    if (passwordPolicyViolationMessage !== null) {
      toast.error(passwordPolicyViolationMessage)
      return
    }
    if (selectedDepotIds.length === 0) {
      toast.error(userDepotsFormMessages.depotsRequired)
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
        loading: "Створення облікового запису...",
        success: "Диспетчера успішно зареєстровано!",
        error: "Не вдалося зареєструвати диспетчера",
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
        + Додати диспетчера
      </Button>
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Реєстрація нового диспетчера"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormField label="Логін (Username)">
            <Input
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="dispatcher_1"
            />
          </FormField>
          <FormField label="Електронна пошта">
            <Input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="disp@fleet.com"
            />
          </FormField>
          <FormField label="Пароль">
            <Input
              required
              type="password"
              autoComplete="new-password"
              minLength={accountPasswordConstraints.minLength}
              maxLength={accountPasswordConstraints.maxLength}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={passwordPolicyMessages.hint}
            />
          </FormField>
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
