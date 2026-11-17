"use client"

import { useTranslations } from "next-intl"
import { Trash2 } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { IconActionButton } from "@/components/icon-action-button"
import { useDeleteWithConfirmation } from "@/hooks/use-delete-with-confirmation"
import { ApiMutationToastMessages } from "@/lib/types"

interface DeleteTableRowActionProps {
  deleteApiPath: string
  deletionQuestion: string
  deletionToastMessages: ApiMutationToastMessages
}

export function DeleteTableRowAction({
  deleteApiPath,
  deletionQuestion,
  deletionToastMessages,
}: DeleteTableRowActionProps) {
  const iconActionTranslations = useTranslations("iconActions")
  const {
    isDeletionConfirmationOpen,
    isDeletionRunning,
    openDeletionConfirmation,
    closeDeletionConfirmation,
    confirmDeletion,
  } = useDeleteWithConfirmation(deleteApiPath, deletionToastMessages)

  return (
    <>
      <IconActionButton
        icon={Trash2}
        label={iconActionTranslations("delete")}
        variant="destructive"
        onClick={openDeletionConfirmation}
        disabled={isDeletionRunning}
      />
      <DeleteConfirmationDialog
        deletionQuestion={isDeletionConfirmationOpen ? deletionQuestion : null}
        isDeleting={isDeletionRunning}
        onConfirm={confirmDeletion}
        onCancel={closeDeletionConfirmation}
      />
    </>
  )
}
