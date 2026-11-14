"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints } from "@/lib/constants"
import { HttpMethod, UserRole } from "@/lib/types"

const minimumPasswordLength = 6

export default function AddDispatcherModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isDispatcherRegistered = await runApiMutation(
      () =>
        sendApiRequest(apiEndpoints.registerAccount, HttpMethod.Post, {
          username: username.trim(),
          email: email.trim(),
          password,
          role: UserRole.Dispatcher,
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
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button
        className="bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => setIsModalOpen(true)}
      >
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
              minLength={minimumPasswordLength}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={`Мінімум ${minimumPasswordLength} символів`}
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
