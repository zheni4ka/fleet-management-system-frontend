"use client"

import { useTranslations } from "next-intl"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

interface DeleteConfirmationDialogProps {
  deletionQuestion: string | null
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmationDialog({
  deletionQuestion,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  const deleteConfirmationTranslations = useTranslations("deleteConfirmation")
  return (
    <ConfirmationDialog
      isOpen={deletionQuestion !== null}
      title={deleteConfirmationTranslations("title")}
      message={deleteConfirmationTranslations("message", {
        deletionQuestion: deletionQuestion ?? "",
      })}
      confirmLabel={deleteConfirmationTranslations("confirmLabel")}
      confirmingLabel={deleteConfirmationTranslations("confirmingLabel")}
      isConfirming={isDeleting}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}
