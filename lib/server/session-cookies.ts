import type { NextRequest, NextResponse } from "next/server"
import { cookieNames } from "@/lib/constants"
import { AppLocale, SessionResponse } from "@/lib/types"

type SessionResponseCookies = NextResponse["cookies"]

type SessionRequestCookies = NextRequest["cookies"]

const localeCookieMaxAgeSeconds = 365 * 24 * 60 * 60

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
  setLocaleResponseCookie(responseCookies, session.preferredLanguage)
}

export function setLocaleResponseCookie(
  responseCookies: SessionResponseCookies,
  appLocale: AppLocale
): void {
  responseCookies.set(cookieNames.locale, appLocale, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: localeCookieMaxAgeSeconds,
  })
}

export function setSessionRequestCookies(
  requestCookies: SessionRequestCookies,
  session: SessionResponse
): void {
  requestCookies.set(cookieNames.accessToken, session.accessToken)
  requestCookies.set(cookieNames.refreshToken, session.refreshToken)
  requestCookies.set(cookieNames.locale, session.preferredLanguage)
}

export function deleteSessionResponseCookies(
  responseCookies: SessionResponseCookies
): void {
  responseCookies.delete(cookieNames.accessToken)
  responseCookies.delete(cookieNames.refreshToken)
}
