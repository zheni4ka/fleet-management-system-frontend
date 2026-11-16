import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import {
  bffErrorMessages,
  commonUiTexts,
  httpStatusCodes,
} from "@/lib/constants"
import { parseApiResponseBody } from "@/lib/api-response-body"
import { postToBackend } from "@/lib/server/backend-api"
import {
  createPassThroughResponse,
  createProblemResponse,
} from "@/lib/server/bff-response"
import {
  isSameOriginRequest,
  readValidatedJsonBody,
} from "@/lib/server/bff-request"
import { setSessionResponseCookies } from "@/lib/server/session-cookies"
import { sessionResponseSchema } from "@/lib/schemas/session-response-schema"

export async function establishBackendSession<
  TRequestSchema extends z.ZodType<object>,
>(
  request: NextRequest,
  sessionApiPath: string,
  requestSchema: TRequestSchema
): Promise<NextResponse> {
  if (!isSameOriginRequest(request)) {
    return createProblemResponse(
      httpStatusCodes.forbidden,
      bffErrorMessages.crossOriginRequestRejected
    )
  }

  const sessionRequestBody = await readValidatedJsonBody(request, requestSchema)
  if (sessionRequestBody === null) {
    return createProblemResponse(
      httpStatusCodes.badRequest,
      bffErrorMessages.invalidRequestBody
    )
  }

  let backendSessionResponse: Response
  try {
    backendSessionResponse = await postToBackend(
      sessionApiPath,
      request.headers,
      sessionRequestBody
    )
  } catch (error) {
    console.error(`Не вдалося виконати запит до ${sessionApiPath}:`, error)
    return createProblemResponse(
      httpStatusCodes.serviceUnavailable,
      commonUiTexts.serverUnavailableMessage
    )
  }

  if (!backendSessionResponse.ok) {
    return createPassThroughResponse(backendSessionResponse)
  }

  const session = parseApiResponseBody(
    sessionApiPath,
    await backendSessionResponse.json(),
    sessionResponseSchema
  )
  const sessionEstablishedResponse = new NextResponse(null, {
    status: httpStatusCodes.noContent,
  })
  setSessionResponseCookies(sessionEstablishedResponse.cookies, session)
  return sessionEstablishedResponse
}
