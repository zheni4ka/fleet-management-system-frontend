import { appRoutes, loginSearchParamNames } from "@/lib/constants"
import { createPathWithSearchParams } from "@/lib/search-params"
import { LoginRedirectReason } from "@/lib/types"

const sameOriginRelativePathPattern = /^\/(?![/\\])/

const controlCharacterPattern = /[\u0000-\u001F\u007F]/

export function getSafeReturnPath(rawReturnUrl: string): string {
  const isSameOriginRelativePath =
    sameOriginRelativePathPattern.test(rawReturnUrl) &&
    !rawReturnUrl.includes("\\") &&
    !controlCharacterPattern.test(rawReturnUrl)
  const isLoginPath =
    rawReturnUrl === appRoutes.login ||
    rawReturnUrl.startsWith(`${appRoutes.login}?`)
  return isSameOriginRelativePath && !isLoginPath
    ? rawReturnUrl
    : appRoutes.home
}

export function createLoginPath(
  returnPath: string | null,
  loginRedirectReason: LoginRedirectReason | null
): string {
  const loginSearchParams = new URLSearchParams()
  if (returnPath !== null && returnPath !== appRoutes.home) {
    loginSearchParams.set(loginSearchParamNames.returnUrl, returnPath)
  }
  if (loginRedirectReason !== null) {
    loginSearchParams.set(loginSearchParamNames.reason, loginRedirectReason)
  }
  return createPathWithSearchParams(appRoutes.login, loginSearchParams)
}
