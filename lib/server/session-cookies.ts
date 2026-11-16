import type { NextRequest, NextResponse } from "next/server"
import { cookieNames } from "@/lib/constants"
import { SessionResponse } from "@/lib/types"

type SessionResponseCookies = NextResponse["cookies"]

type SessionRequestCookies = NextRequest["cookies"]

function createSessionCookieOptions(refreshTokenExpiresAtUtc: string) {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    expires: new Date(refreshTokenExpiresAtUtc),
  }
}

export function setSessionResponseCookies(
  responseCookies: SessionResponseCookies,
  session: SessionResponse
): void {
  const sessionCookieOptions = createSessionCookieOptions(
    session.refreshTokenExpiresAtUtc
  )
  responseCookies.set(
    cookieNames.accessToken,
    session.accessToken,
    sessionCookieOptions
  )
  responseCookies.set(
    cookieNames.refreshToken,
    session.refreshToken,
    sessionCookieOptions
  )
}

export function setSessionRequestCookies(
  requestCookies: SessionRequestCookies,
  session: SessionResponse
): void {
  requestCookies.set(cookieNames.accessToken, session.accessToken)
  requestCookies.set(cookieNames.refreshToken, session.refreshToken)
}

export function deleteSessionResponseCookies(
  responseCookies: SessionResponseCookies
): void {
  responseCookies.delete(cookieNames.accessToken)
  responseCookies.delete(cookieNames.refreshToken)
}
