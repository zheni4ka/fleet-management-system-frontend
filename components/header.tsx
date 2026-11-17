"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Menu, Truck, X } from "lucide-react"
import toast from "react-hot-toast"
import { useTranslations } from "next-intl"
import { LanguageSwitch } from "@/components/language-switch"
import { appRoutes, bffRoutes, headerNavigationLinks } from "@/lib/constants"
import { isNavigationLinkActive } from "@/lib/navigation"
import { HttpMethod, NavigationLink, UserRole } from "@/lib/types"
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string
  isAdmin: boolean
  currentUserName: string | null
  currentUserRoles: ReadonlyArray<UserRole>
}

const mobileNavigationMenuId = "header-mobile-navigation"

const headerLinkClassName =
  "flex items-center gap-1 rounded-xl px-2.5 py-2 text-slate-200 transition motion-safe:duration-300 motion-safe:hover:scale-105 hover:bg-slate-700 hover:text-white"

const activeHeaderLinkClassName = "bg-slate-700 text-white"

const logoutButtonClassName =
  "flex cursor-pointer items-center gap-2 rounded-xl bg-red-500/20 px-3 py-2 text-red-100 transition motion-safe:duration-300 motion-safe:hover:scale-105 hover:bg-red-600/80"

export function Header({
  className,
  isAdmin,
  currentUserName,
  currentUserRoles,
}: HeaderProps) {
  const router = useRouter()
  const navigationTranslations = useTranslations("navigation")
  const userRoleTranslations = useTranslations("userRoles")
  const currentPathname = usePathname()
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const mobileNavigationToggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isMobileNavigationOpen) {
      return
    }
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileNavigationOpen(false)
        mobileNavigationToggleRef.current?.focus()
      }
    }
    const handleDocumentPointerDown = (event: PointerEvent) => {
      const isPointerOutsideHeader =
        event.target instanceof Node &&
        headerRef.current !== null &&
        !headerRef.current.contains(event.target)
      if (isPointerOutsideHeader) {
        setIsMobileNavigationOpen(false)
      }
    }
    document.addEventListener("keydown", handleDocumentKeyDown)
    document.addEventListener("pointerdown", handleDocumentPointerDown)
    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown)
      document.removeEventListener("pointerdown", handleDocumentPointerDown)
    }
  }, [isMobileNavigationOpen])

  const handleLogout = async () => {
    try {
      const logoutResponse = await fetch(bffRoutes.sessionLogout, {
        method: HttpMethod.Post,
      })
      if (!logoutResponse.ok) {
        toast.error(navigationTranslations("logoutFailed"))
        return
      }
    } catch (error) {
      console.error(navigationTranslations("logoutFailed"), error)
      toast.error(navigationTranslations("logoutFailed"))
      return
    }
    router.push(appRoutes.login)
    router.refresh()
  }

  const navigationLinks: ReadonlyArray<NavigationLink> = [
    { href: appRoutes.home, labelMessageKey: "home", isAdminOnly: false },
    ...headerNavigationLinks.filter(
      (navigationLink) => isAdmin || !navigationLink.isAdminOnly
    ),
  ]

  const currentUserRolesLabel = currentUserRoles
    .map((currentUserRole) => userRoleTranslations(currentUserRole))
    .join(", ")
  const currentUserDescription = [currentUserName, currentUserRolesLabel]
    .filter(
      (currentUserDescriptionPart): currentUserDescriptionPart is string =>
        currentUserDescriptionPart !== null && currentUserDescriptionPart !== ""
    )
    .join(" · ")

  const renderNavigationLinks = (isMobileNavigationLink: boolean) =>
    navigationLinks.map((navigationLink) => {
      const isActiveNavigationLink = isNavigationLinkActive(
        currentPathname,
        navigationLink.href
      )
      return (
        <Link
          key={navigationLink.href}
          href={navigationLink.href}
          aria-current={isActiveNavigationLink ? "page" : undefined}
          onClick={() => setIsMobileNavigationOpen(false)}
          className={cn(
            headerLinkClassName,
            isActiveNavigationLink && activeHeaderLinkClassName,
            isMobileNavigationLink && "w-full motion-safe:hover:scale-100"
          )}
        >
          {navigationLink.href === appRoutes.home && (
            <Truck aria-hidden="true" size={20} />
          )}
          {navigationTranslations(navigationLink.labelMessageKey)}
        </Link>
      )
    })

  const activeNavigationLink = navigationLinks.find((navigationLink) =>
    isNavigationLinkActive(currentPathname, navigationLink.href)
  )
  const activeNavigationLinkLabel =
    activeNavigationLink === undefined
      ? null
      : navigationTranslations(activeNavigationLink.labelMessageKey)

  const renderCurrentUserDescription = (descriptionClassName: string) =>
    currentUserDescription === "" ? null : (
      <span className={descriptionClassName}>{currentUserDescription}</span>
    )

  return (
    <header ref={headerRef} className={className}>
      <nav
        aria-label={navigationTranslations("mainNavigation")}
        className="relative flex h-14 items-center justify-between gap-3 bg-slate-900 px-4 text-sm font-medium text-white shadow-md"
      >
        <div className="hidden items-center gap-1 md:flex">
          {renderNavigationLinks(false)}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            ref={mobileNavigationToggleRef}
            type="button"
            aria-expanded={isMobileNavigationOpen}
            aria-controls={mobileNavigationMenuId}
            aria-label={
              isMobileNavigationOpen
                ? navigationTranslations("closeMenu")
                : navigationTranslations("openMenu")
            }
            onClick={() =>
              setIsMobileNavigationOpen(
                (isMobileNavigationOpenBefore) => !isMobileNavigationOpenBefore
              )
            }
            className="flex size-10 cursor-pointer items-center justify-center rounded-xl text-slate-200 hover:bg-slate-700 hover:text-white"
          >
            {isMobileNavigationOpen ? (
              <X aria-hidden="true" size={22} />
            ) : (
              <Menu aria-hidden="true" size={22} />
            )}
          </button>
          <span className="font-semibold">{activeNavigationLinkLabel}</span>
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <LanguageSwitch />
          {renderCurrentUserDescription(
            "hidden truncate text-slate-300 lg:inline"
          )}
          <button
            type="button"
            onClick={handleLogout}
            className={logoutButtonClassName}
          >
            <LogOut aria-hidden="true" size={18} />
            {navigationTranslations("logout")}
          </button>
        </div>

        <div
          id={mobileNavigationMenuId}
          hidden={!isMobileNavigationOpen}
          className="absolute inset-x-0 top-full border-t border-slate-700 bg-slate-900 p-3 shadow-lg md:hidden"
        >
          <div className="flex flex-col gap-1">
            {renderNavigationLinks(true)}
          </div>
          {renderCurrentUserDescription(
            "mt-3 block border-t border-slate-700 px-2.5 pt-3 text-slate-300"
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
