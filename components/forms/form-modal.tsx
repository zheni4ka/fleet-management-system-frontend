"use client"

import * as React from "react"
import { type FormEvent } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"
import { ModalWindowSize } from "@/lib/types"

interface FormModalProps {
  isOpen: boolean
  title: string
  size?: ModalWindowSize
  isSubmitting: boolean
  submitButtonLabel: string
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  children: React.ReactNode
}

export function FormModal({
  isOpen,
  title,
  size = ModalWindowSize.Wide,
  isSubmitting,
  submitButtonLabel,
  onClose,
  onSubmit,
  children,
}: FormModalProps) {
  const commonTranslations = useTranslations("common")
  return (
    <ModalWindow isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">{children}</div>
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {commonTranslations("requiredFieldsNote")}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onClose}
            >
              {commonTranslations("cancelButtonLabel")}
            </Button>
            <Button type="submit" variant="accent" disabled={isSubmitting}>
              {isSubmitting
                ? commonTranslations("savingLabel")
                : submitButtonLabel}
            </Button>
          </div>
        </div>
      </form>
    </ModalWindow>
  )
}
