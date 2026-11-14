import { appRoutes } from "@/lib/constants"

export function isNavigationLinkActive(
  currentPathname: string,
  navigationLinkHref: string
): boolean {
  if (navigationLinkHref === appRoutes.home) {
    return currentPathname === appRoutes.home
  }
  return (
    currentPathname === navigationLinkHref ||
    currentPathname.startsWith(`${navigationLinkHref}/`)
  )
}
