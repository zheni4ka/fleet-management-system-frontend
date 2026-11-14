import Link from "next/link"
import { fastAccessNavigationLinks } from "@/lib/constants"

interface FastAccessLinkProps {
  href: string
  label: string
}

function FastAccessLink({ href, label }: FastAccessLinkProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors hover:border-indigo-200 hover:bg-indigo-50"
    >
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <span className="shrink-0 text-lg text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-600">
        →
      </span>
    </Link>
  )
}

interface FastAccessProps {
  isAdmin: boolean
}

export default function FastAccess({ isAdmin }: FastAccessProps) {
  const visibleFastAccessNavigationLinks = fastAccessNavigationLinks.filter(
    (navigationLink) => isAdmin || !navigationLink.isAdminOnly
  )

  return (
    <div>
      <p className="text-sm text-slate-500">Керування автопарком в один клік</p>
      <div className="mt-4 flex flex-col gap-2">
        {visibleFastAccessNavigationLinks.map((navigationLink) => (
          <FastAccessLink
            key={navigationLink.href}
            href={navigationLink.href}
            label={navigationLink.label}
          />
        ))}
      </div>
    </div>
  )
}
