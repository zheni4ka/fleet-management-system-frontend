import { NextResponse, type NextRequest } from "next/server"
import { isAuthTokenUnexpiredForAtLeast } from "@/lib/auth-token"
import {
  appRoutes,
  bffRoutes,
  cookieNames,
  httpHeaderNames,
  httpStatusCodes,
  sessionRefreshSettings,
} from "@/lib/constants"
import { resolveAppLocale } from "@/lib/app-locale"
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
import { createRequestMessageTranslator } from "@/lib/server/request-message-translator"

function isApiProxyRequest(request: NextRequest): boolean {
  return request.nextUrl.pathname.startsWith(`${bffRoutes.apiProxy}/`)
}

function endExpiredSession(request: NextRequest): NextResponse {
  const expiredSessionResponse = isApiProxyRequest(request)
    ? createProblemResponse(
        httpStatusCodes.unauthorized,
        createRequestMessageTranslator(request)("common.sessionExpiredMessage")
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

function prepareForwardedRequestHeaders(request: NextRequest): void {
  request.headers.set(
    httpHeaderNames.acceptLanguage,
    resolveAppLocale(request.cookies.get(cookieNames.locale)?.value)
  )
  const incomingTraceparent = request.headers.get(httpHeaderNames.traceparent)
  const isIncomingTraceparentValid =
    incomingTraceparent !== null &&
    getTraceIdFromTraceparent(incomingTraceparent) !== null
  if (!isIncomingTraceparentValid) {
    request.headers.set(httpHeaderNames.traceparent, createTraceparent())
  }
}

export async function proxy(request: NextRequest) {
  prepareForwardedRequestHeaders(request)
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
      prepareForwardedRequestHeaders(request)
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
