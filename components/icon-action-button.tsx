import type { ComponentProps } from "react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IconActionButtonProps extends Omit<
  ComponentProps<typeof Button>,
  "children" | "size" | "title" | "aria-label"
> {
  icon: LucideIcon
  label: string
}

export function IconActionButton({
  icon: Icon,
  label,
  ...buttonProps
}: IconActionButtonProps) {
  return (
    <Button size="icon-sm" aria-label={label} title={label} {...buttonProps}>
      <Icon aria-hidden="true" />
    </Button>
  )
}
