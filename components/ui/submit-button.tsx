import * as React from "react"
import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
  isSubmitting: boolean
  children: React.ReactNode
}

export function SubmitButton({ isSubmitting, children }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      variant="accent"
      size="lg"
      hoverEffect="grow-subtle"
      className="mt-2"
    >
      {isSubmitting ? "Збереження..." : children}
    </Button>
  )
}
