"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Truck } from "lucide-react"
import { appRoutes, cookieNames, headerNavigationLinks } from "@/lib/constants"
import { deleteBrowserCookie } from "@/lib/browser-cookies"

interface HeaderProps {
  className?: string
  isAdmin: boolean
}

const headerLinkClassName =
  "rounded-2xl p-2 transition-transform duration-300 hover:scale-105 hover:bg-slate-700"

export function Header({ className, isAdmin }: HeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    deleteBrowserCookie(cookieNames.authToken)
    router.push(appRoutes.login)
    router.refresh()
  }

  const visibleHeaderNavigationLinks = headerNavigationLinks.filter(
    (navigationLink) => isAdmin || !navigationLink.isAdminOnly
  )

  return (
    <div className={className}>
      <nav className="flex items-center justify-between bg-slate-900 p-1.5 px-4 font-medium text-white shadow-md">
        <div className="flex gap-3">
          <Link
            href={appRoutes.home}
            className={`${headerLinkClassName} flex items-center gap-1`}
          >
            <Truck size={20} />
            Головна
          </Link>
          {visibleHeaderNavigationLinks.map((navigationLink) => (
            <Link
              key={navigationLink.href}
              href={navigationLink.href}
              className={headerLinkClassName}
            >
              {navigationLink.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-2 rounded-2xl bg-red-500/20 p-2 px-3 text-red-100 transition-transform duration-300 hover:scale-105 hover:bg-red-600/80"
        >
          <LogOut size={18} />
          Вийти
        </button>
      </nav>
    </div>
  )
}

export default Header
