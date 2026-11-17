import { NextResponse, type NextRequest } from "next/server"
import {
  apiEndpoints,
  cookieNames,
  httpStatusCodes,
} from "@/lib/constants"
import {
  createBackendRequestHeaders,
  getServerApiBaseUrl,
} from "@/lib/server/backend-api"
import {
  createPassThroughResponse,
  createProblemResponse,
} from "@/lib/server/bff-response"
import {
  isSameOriginRequest,
  readValidatedJsonBody,
} from "@/lib/server/bff-request"
import { setLocaleResponseCookie } from "@/lib/server/session-cookies"
import { updateLanguageRequestSchema } from "@/lib/schemas/update-language-request-schema"
import { HttpMethod } from "@/lib/types"
import { createRequestMessageTranslator } from "@/lib/server/request-message-translator"

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return createProblemResponse(
      httpStatusCodes.forbidden,
      createRequestMessageTranslator(request)("bffErrors.crossOriginRequestRejected")
    )
  }

  const updateLanguageRequest = await readValidatedJsonBody(
    request,
    updateLanguageRequestSchema
  )
  if (updateLanguageRequest === null) {
    return createProblemResponse(
      httpStatusCodes.badRequest,
      createRequestMessageTranslator(request)("bffErrors.invalidRequestBody")
    )
  }

  const accessToken = request.cookies.get(cookieNames.accessToken)?.value
  if (accessToken === undefined) {
    return createProblemResponse(
      httpStatusCodes.unauthorized,
      createRequestMessageTranslator(request)("common.sessionExpiredMessage")
    )
  }

  let backendLanguageResponse: Response
  try {
    backendLanguageResponse = await fetch(
      `${getServerApiBaseUrl()}${apiEndpoints.updatePreferredLanguage}`,
      {
        method: HttpMethod.Put,
        headers: createBackendRequestHeaders(request.headers, accessToken),
        body: JSON.stringify(updateLanguageRequest),
        cache: "no-store",
      }
    )
  } catch (error) {
    console.error("Не вдалося змінити мову користувача:", error)
    return createProblemResponse(
      httpStatusCodes.serviceUnavailable,
      createRequestMessageTranslator(request)("common.serverUnavailableMessage")
    )
  }
  if (!backendLanguageResponse.ok) {
    return createPassThroughResponse(backendLanguageResponse)
  }

  const languageChangedResponse = new NextResponse(null, {
    status: httpStatusCodes.noContent,
  })
  setLocaleResponseCookie(
    languageChangedResponse.cookies,
    updateLanguageRequest.language
  )
  return languageChangedResponse
}
