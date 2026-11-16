import * as React from "react"
import { badgeToneClassNames } from "@/lib/constants"
import { BadgeTone } from "@/lib/types"
import { cn } from "@/lib/utils"

interface BadgeProps {
  tone: BadgeTone
  children: React.ReactNode
}

export function Badge({ tone, children }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        badgeToneClassNames[tone]
      )}
    >
      {children}
    </span>
  )
}
