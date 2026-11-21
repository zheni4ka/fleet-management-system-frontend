"use client"

import { useEffect, useId, useRef } from "react"
import { useTranslations } from "next-intl"
import { AppToaster } from "@/components/app-toaster"
import { modalWindowSizeClassNames } from "@/lib/constants"
import {
  pushOpenModalWindowId,
  removeOpenModalWindowId,
} from "@/lib/open-modal-window-stack"
import { ModalWindowSize } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  size?: ModalWindowSize
  children: React.ReactNode
}

export default function ModalWindow({
  isOpen,
  onClose,
  title,
  size = ModalWindowSize.Default,
  children,
}: ModalProps) {
  const commonTranslations = useTranslations("common")
  const dialogRef = useRef<HTMLDialogElement>(null)
  const elementFocusedBeforeOpenRef = useRef<HTMLElement | null>(null)
  const modalWindowId = useId()

  useEffect(() => {
    if (!isOpen) {
      return
    }
    pushOpenModalWindowId(modalWindowId)
    return () => removeOpenModalWindowId(modalWindowId)
  }, [isOpen, modalWindowId])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }
    if (isOpen && !dialog.open) {
      elementFocusedBeforeOpenRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
      dialog.showModal()
    }
    if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  const handleDialogClose = () => {
    elementFocusedBeforeOpenRef.current?.focus()
    onClose()
  }

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleDialogClose}
      onClick={handleBackdropClick}
      className={cn(
        "fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-lg border border-gray-200 p-6 shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm",
        modalWindowSizeClassNames[size]
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={commonTranslations("closeButtonLabel")}
          className="cursor-pointer rounded-md text-2xl leading-none font-bold text-gray-500 hover:text-gray-700"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="flex flex-col gap-3 text-gray-600">{children}</div>
      <AppToaster modalWindowId={modalWindowId} />
    </dialog>
  )
}
