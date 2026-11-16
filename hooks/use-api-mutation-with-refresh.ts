"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { ConcurrencyConflictError } from "@/lib/concurrency-conflict-error"
import { SessionExpiredError } from "@/lib/session-expired-error"
import { ApiMutationToastMessages } from "@/lib/types"

export function useApiMutationWithRefresh() {
  const router = useRouter()
  const [isApiMutationRunning, setIsApiMutationRunning] = useState(false)

  const runApiMutation = async (
    createApiMutationRequest: () => Promise<void>,
    toastMessages: ApiMutationToastMessages,
    handleConcurrencyConflict?: () => void
  ): Promise<boolean> => {
    setIsApiMutationRunning(true)
    const mutationToastId = toast.loading(toastMessages.loading)
    try {
      await createApiMutationRequest()
      toast.success(toastMessages.success, { id: mutationToastId })
      router.refresh()
      return true
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        toast.dismiss(mutationToastId)
        return false
      }
      if (error instanceof ConcurrencyConflictError) {
        toast.error(error.message, { id: mutationToastId })
        handleConcurrencyConflict?.()
        router.refresh()
        return false
      }
      console.error(toastMessages.error, error)
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : toastMessages.error,
        { id: mutationToastId }
      )
      return false
    } finally {
      setIsApiMutationRunning(false)
    }
  }

  return { isApiMutationRunning, runApiMutation }
}
