import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
  isSubmitting: boolean
  children: React.ReactNode
}

export function SubmitButton({ isSubmitting, children }: SubmitButtonProps) {
  const commonTranslations = useTranslations("common")
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      variant="accent"
      size="lg"
      hoverEffect="grow-subtle"
      className="mt-2"
    >
      {isSubmitting ? commonTranslations("savingLabel") : children}
    </Button>
  )
}
