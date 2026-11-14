"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { ApiMutationToastMessages } from "@/lib/types"

export function useApiMutationWithRefresh() {
  const router = useRouter()
  const [isApiMutationRunning, setIsApiMutationRunning] = useState(false)

  const runApiMutation = async (
    createApiMutationRequest: () => Promise<void>,
    toastMessages: ApiMutationToastMessages
  ): Promise<boolean> => {
    setIsApiMutationRunning(true)
    try {
      await toast.promise(createApiMutationRequest(), {
        loading: toastMessages.loading,
        success: toastMessages.success,
        error: (error: unknown) =>
          error instanceof Error && error.message
            ? error.message
            : toastMessages.error,
      })
      router.refresh()
      return true
    } catch (error) {
      console.error(toastMessages.error, error)
      return false
    } finally {
      setIsApiMutationRunning(false)
    }
  }

  return { isApiMutationRunning, runApiMutation }
}
