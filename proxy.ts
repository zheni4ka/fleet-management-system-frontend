import { NextResponse, type NextRequest } from "next/server"
import { isAuthTokenUnexpiredForAtLeast } from "@/lib/auth-token"
import {
  appRoutes,
  bffRoutes,
  commonUiTexts,
  cookieNames,
  httpHeaderNames,
  httpStatusCodes,
  sessionRefreshSettings,
} from "@/lib/constants"
import { createLoginPath } from "@/lib/login-redirect"
import { refreshBackendSession } from "@/lib/server/backend-session"
import {
  createTraceparent,
  getTraceIdFromTraceparent,
} from "@/lib/trace-context"
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

function continueWithTracedRequest(request: NextRequest): NextResponse {
  return NextResponse.next({ request: { headers: request.headers } })
}

function ensureRequestTraceparent(request: NextRequest): void {
  const incomingTraceparent = request.headers.get(httpHeaderNames.traceparent)
  const isIncomingTraceparentValid =
    incomingTraceparent !== null &&
    getTraceIdFromTraceparent(incomingTraceparent) !== null
  if (!isIncomingTraceparentValid) {
    request.headers.set(httpHeaderNames.traceparent, createTraceparent())
  }
}

export async function proxy(request: NextRequest) {
  ensureRequestTraceparent(request)
  const isLoginPageRequested = request.nextUrl.pathname === appRoutes.login
  const isSessionRouteRequested = request.nextUrl.pathname.startsWith(
    bffRoutes.sessionPrefix
  )
  if (isLoginPageRequested || isSessionRouteRequested) {
    return continueWithTracedRequest(request)
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
    return continueWithTracedRequest(request)
  }

  if (refreshToken === undefined) {
    return accessToken === undefined
      ? continueWithTracedRequest(request)
      : endExpiredSession(request)
  }

  const sessionRefreshResult = await refreshBackendSession(
    refreshToken,
    request.headers
  )
  switch (sessionRefreshResult.status) {
    case SessionRefreshStatus.Refreshed: {
      setSessionRequestCookies(request.cookies, sessionRefreshResult.session)
      const refreshedSessionResponse = continueWithTracedRequest(request)
      setSessionResponseCookies(
        refreshedSessionResponse.cookies,
        sessionRefreshResult.session
      )
      return refreshedSessionResponse
    }
    case SessionRefreshStatus.Rejected:
      return endExpiredSession(request)
    case SessionRefreshStatus.BackendUnavailable:
      return continueWithTracedRequest(request)
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
