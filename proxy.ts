import { NextResponse, type NextRequest } from "next/server"
import { isAuthTokenUnexpired } from "@/lib/auth-token"
import { appRoutes, cookieNames } from "@/lib/constants"
import { createLoginPath } from "@/lib/login-redirect"
import { LoginRedirectReason } from "@/lib/types"

export function proxy(request: NextRequest) {
  const authToken = request.cookies.get(cookieNames.authToken)?.value
  const isLoginPageRequested = request.nextUrl.pathname === appRoutes.login
  if (
    authToken === undefined ||
    isAuthTokenUnexpired(authToken) ||
    isLoginPageRequested
  ) {
    return NextResponse.next()
  }

  const expiredSessionReturnPath = `${request.nextUrl.pathname}${request.nextUrl.search}`
  const loginRedirectResponse = NextResponse.redirect(
    new URL(
      createLoginPath(
        expiredSessionReturnPath,
        LoginRedirectReason.SessionExpired
      ),
      request.url
    )
  )
  loginRedirectResponse.cookies.delete(cookieNames.authToken)
  return loginRedirectResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
