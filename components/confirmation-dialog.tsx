"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel: string
  confirmingLabel: string
  isConfirming: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmingLabel,
  isConfirming,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const elementFocusedBeforeOpenRef = useRef<HTMLElement | null>(null)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isDialogOpen) => {
        if (!isDialogOpen && !isConfirming) {
          onCancel()
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          elementFocusedBeforeOpenRef.current =
            document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null
          confirmButtonRef.current?.focus()
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          elementFocusedBeforeOpenRef.current?.focus()
        }}
        className="motion-reduce:animate-none"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isConfirming}
            onClick={onCancel}
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            Скасувати
          </Button>
          <Button
            ref={confirmButtonRef}
            type="button"
            aria-disabled={isConfirming}
            onClick={isConfirming ? undefined : onConfirm}
            className="cursor-pointer bg-red-600 text-white hover:bg-red-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          >
            {isConfirming ? confirmingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
