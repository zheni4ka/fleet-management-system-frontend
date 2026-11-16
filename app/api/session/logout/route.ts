import { NextResponse, type NextRequest } from "next/server"
import {
  apiEndpoints,
  bffErrorMessages,
  cookieNames,
  httpStatusCodes,
} from "@/lib/constants"
import { postToBackend } from "@/lib/server/backend-api"
import { createProblemResponse } from "@/lib/server/bff-response"
import { isSameOriginRequest } from "@/lib/server/bff-request"
import { deleteSessionResponseCookies } from "@/lib/server/session-cookies"

async function revokeBackendRefreshToken(
  refreshToken: string,
  incomingRequestHeaders: Headers
): Promise<void> {
  try {
    const backendLogoutResponse = await postToBackend(
      apiEndpoints.logout,
      incomingRequestHeaders,
      { refreshToken }
    )
    const isRefreshTokenRevokedOrAlreadyInvalid =
      backendLogoutResponse.ok ||
      backendLogoutResponse.status === httpStatusCodes.unauthorized
    if (!isRefreshTokenRevokedOrAlreadyInvalid) {
      console.error(
        `Сервер не відкликав токен оновлення під час виходу: статус ${backendLogoutResponse.status}.`
      )
    }
  } catch (error) {
    console.error("Не вдалося відкликати токен оновлення під час виходу:", error)
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return createProblemResponse(
      httpStatusCodes.forbidden,
      bffErrorMessages.crossOriginRequestRejected
    )
  }

  const refreshToken = request.cookies.get(cookieNames.refreshToken)?.value
  if (refreshToken !== undefined) {
    await revokeBackendRefreshToken(refreshToken, request.headers)
  }

  const loggedOutResponse = new NextResponse(null, {
    status: httpStatusCodes.noContent,
  })
  deleteSessionResponseCookies(loggedOutResponse.cookies)
  return loggedOutResponse
}
