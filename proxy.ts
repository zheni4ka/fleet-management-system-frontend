import { NextResponse, type NextRequest } from "next/server"
import { isAuthTokenUnexpiredForAtLeast } from "@/lib/auth-token"
import {
  appRoutes,
  bffRoutes,
  commonUiTexts,
  cookieNames,
  httpStatusCodes,
  sessionRefreshSettings,
} from "@/lib/constants"
import { createLoginPath } from "@/lib/login-redirect"
import { refreshBackendSession } from "@/lib/server/backend-session"
import { createProblemResponse } from "@/lib/server/bff-response"
import {
  deleteSessionResponseCookies,
  setSessionRequestCookies,
  setSessionResponseCookies,
} from "@/lib/server/session-cookies"
import { LoginRedirectReason, SessionRefreshStatus } from "@/lib/types"

function isApiProxyRequest(request: NextRequest): boolean {
  return request.nextUrl.pathname.startsWith(`${bffRoutes.apiProxy}/`)
}

function endExpiredSession(request: NextRequest): NextResponse {
  const expiredSessionResponse = isApiProxyRequest(request)
    ? createProblemResponse(
        httpStatusCodes.unauthorized,
        commonUiTexts.sessionExpiredMessage
      )
    : NextResponse.redirect(
        new URL(
          createLoginPath(
            `${request.nextUrl.pathname}${request.nextUrl.search}`,
            LoginRedirectReason.SessionExpired
          ),
          request.url
        )
      )
  deleteSessionResponseCookies(expiredSessionResponse.cookies)
  return expiredSessionResponse
}

export async function proxy(request: NextRequest) {
  const isLoginPageRequested = request.nextUrl.pathname === appRoutes.login
  const isSessionRouteRequested = request.nextUrl.pathname.startsWith(
    bffRoutes.sessionPrefix
  )
  if (isLoginPageRequested || isSessionRouteRequested) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get(cookieNames.accessToken)?.value
  const refreshToken = request.cookies.get(cookieNames.refreshToken)?.value
  const isAccessTokenUsable =
    accessToken !== undefined &&
    isAuthTokenUnexpiredForAtLeast(
      accessToken,
      sessionRefreshSettings.accessTokenRefreshLeadMilliseconds
    )
  if (isAccessTokenUsable) {
    return NextResponse.next()
  }

  if (refreshToken === undefined) {
    return accessToken === undefined
      ? NextResponse.next()
      : endExpiredSession(request)
  }

  const sessionRefreshResult = await refreshBackendSession(
    refreshToken,
    request.headers
  )
  switch (sessionRefreshResult.status) {
    case SessionRefreshStatus.Refreshed: {
      setSessionRequestCookies(request.cookies, sessionRefreshResult.session)
      const refreshedSessionResponse = NextResponse.next({
        request: { headers: request.headers },
      })
      setSessionResponseCookies(
        refreshedSessionResponse.cookies,
        sessionRefreshResult.session
      )
      return refreshedSessionResponse
    }
    case SessionRefreshStatus.Rejected:
      return endExpiredSession(request)
    case SessionRefreshStatus.BackendUnavailable:
      return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
