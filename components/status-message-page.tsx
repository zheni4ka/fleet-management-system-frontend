import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface StatusMessagePageProps {
  icon: LucideIcon
  title: string
  description: string
  children: ReactNode
}

export function StatusMessagePage({
  icon: StatusIcon,
  title,
  description,
  children,
}: StatusMessagePageProps) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 p-8 text-center">
      <StatusIcon aria-hidden="true" className="size-12 text-slate-500" />
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="text-slate-600">{description}</p>
      <div className="flex flex-wrap justify-center gap-3">{children}</div>
    </div>
  )
}
