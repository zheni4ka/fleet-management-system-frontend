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
      className="mt-2 h-9 bg-blue-600 text-white transition hover:bg-blue-700 motion-safe:duration-300 motion-safe:hover:scale-[1.02]"
    >
      {isSubmitting ? "Збереження..." : children}
    </Button>
  )
}
