"use client"

import { useState } from "react"
import { ArchiveRestore, Trash2 } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { IconActionButton } from "@/components/icon-action-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest, sendApiRequestForData } from "@/lib/api-client"
import { iconActionLabels } from "@/lib/constants"
import { archivingDeleteResponseSchema } from "@/lib/schemas/archiving-delete-response-schema"
import { ApiMutationToastMessages, HttpMethod } from "@/lib/types"

interface ArchivableTableRowActionsProps {
  isArchived: boolean
  deleteApiPath: string
  restoreApiPath: string
  deletionQuestion: string
  deletionToastMessages: ApiMutationToastMessages
  archivedInsteadOfDeletedMessage: string
  restoreToastMessages: ApiMutationToastMessages
}

export function ArchivableTableRowActions({
  isArchived,
  deleteApiPath,
  restoreApiPath,
  deletionQuestion,
  deletionToastMessages,
  archivedInsteadOfDeletedMessage,
  restoreToastMessages,
}: ArchivableTableRowActionsProps) {
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()
  const [isDeletionConfirmationOpen, setIsDeletionConfirmationOpen] =
    useState(false)

  if (isArchived) {
    return (
      <IconActionButton
        icon={ArchiveRestore}
        label={iconActionLabels.restore}
        variant="outline"
        disabled={isApiMutationRunning}
        onClick={() =>
          void runApiMutation(
            () => sendApiRequest(restoreApiPath, HttpMethod.Post),
            restoreToastMessages
          )
        }
      />
    )
  }

  const confirmDeletion = async () => {
    const isDeletionCompleted = await runApiMutation(async () => {
      const deleteResponse = await sendApiRequestForData(
        deleteApiPath,
        HttpMethod.Delete,
        archivingDeleteResponseSchema
      )
      return deleteResponse.isArchivedInsteadOfDeleted
        ? archivedInsteadOfDeletedMessage
        : undefined
    }, deletionToastMessages)
    if (isDeletionCompleted) {
      setIsDeletionConfirmationOpen(false)
    }
  }

  return (
    <>
      <IconActionButton
        icon={Trash2}
        label={iconActionLabels.delete}
        variant="destructive"
        onClick={() => setIsDeletionConfirmationOpen(true)}
        disabled={isApiMutationRunning}
      />
      <DeleteConfirmationDialog
        deletionQuestion={isDeletionConfirmationOpen ? deletionQuestion : null}
        isDeleting={isApiMutationRunning}
        onConfirm={confirmDeletion}
        onCancel={() => setIsDeletionConfirmationOpen(false)}
      />
    </>
  )
}
