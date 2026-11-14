"use client"

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
  return (
    <ConfirmationDialog
      isOpen={deletionQuestion !== null}
      title="Підтвердження видалення"
      message={`${deletionQuestion ?? ""} Цю дію неможливо скасувати.`}
      confirmLabel="Видалити"
      confirmingLabel="Видалення..."
      isConfirming={isDeleting}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}
