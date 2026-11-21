"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useApiErrorMessageResolver } from "@/hooks/use-api-error-message-resolver"
import { ApiRequestFailedError } from "@/lib/api-request-failed-error"
import { ConcurrencyConflictError } from "@/lib/concurrency-conflict-error"
import { SessionExpiredError } from "@/lib/session-expired-error"
import { ApiFieldErrorMessages, ApiMutationToastMessages } from "@/lib/types"

export function useApiMutationWithRefresh() {
  const router = useRouter()
  const resolveApiErrorMessage = useApiErrorMessageResolver()
  const [isApiMutationRunning, setIsApiMutationRunning] = useState(false)

  const runApiMutation = async (
    createApiMutationRequest: () => Promise<string | void>,
    toastMessages: ApiMutationToastMessages,
    handleConcurrencyConflict?: () => void,
    handleApiFieldErrorMessages?: (
      apiFieldErrorMessages: ApiFieldErrorMessages
    ) => void
  ): Promise<boolean> => {
    setIsApiMutationRunning(true)
    const mutationToastId = toast.loading(toastMessages.loading)
    try {
      const successMessageOverride = await createApiMutationRequest()
      toast.success(
        typeof successMessageOverride === "string"
          ? successMessageOverride
          : toastMessages.success,
        { id: mutationToastId }
      )
      router.refresh()
      return true
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        toast.dismiss(mutationToastId)
        return false
      }
      if (error instanceof ConcurrencyConflictError) {
        toast.error(resolveApiErrorMessage(error, toastMessages.error), {
          id: mutationToastId,
        })
        handleConcurrencyConflict?.()
        router.refresh()
        return false
      }
      if (
        error instanceof ApiRequestFailedError &&
        Object.keys(error.apiFieldErrorMessages).length > 0
      ) {
        handleApiFieldErrorMessages?.(error.apiFieldErrorMessages)
      }
      console.error(toastMessages.error, error)
      toast.error(resolveApiErrorMessage(error, toastMessages.error), {
        id: mutationToastId,
      })
      return false
    } finally {
      setIsApiMutationRunning(false)
    }
  }

  return { isApiMutationRunning, runApiMutation }
}
