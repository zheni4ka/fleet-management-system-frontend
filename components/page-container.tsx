import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

export function PageContainer({
  className,
  ...divProps
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto max-w-6xl space-y-6 px-1 py-6 sm:p-8 print:max-w-none print:space-y-4 print:p-0",
        className
      )}
      {...divProps}
    />
  )
}
