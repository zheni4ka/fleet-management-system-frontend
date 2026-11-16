"use client"

import { useState } from "react"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { ApiMutationToastMessages, HttpMethod } from "@/lib/types"

export function useDeleteWithConfirmation(
  deleteApiPath: string,
  deletionToastMessages: ApiMutationToastMessages
) {
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()
  const [isDeletionConfirmationOpen, setIsDeletionConfirmationOpen] =
    useState(false)

  const confirmDeletion = async () => {
    const isItemDeleted = await runApiMutation(
      () => sendApiRequest(deleteApiPath, HttpMethod.Delete),
      deletionToastMessages
    )
    if (isItemDeleted) {
      setIsDeletionConfirmationOpen(false)
    }
  }

  return {
    isDeletionConfirmationOpen,
    isDeletionRunning: isApiMutationRunning,
    openDeletionConfirmation: () => setIsDeletionConfirmationOpen(true),
    closeDeletionConfirmation: () => setIsDeletionConfirmationOpen(false),
    confirmDeletion,
  }
}
