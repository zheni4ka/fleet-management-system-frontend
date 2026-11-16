import type { NextRequest } from "next/server"
import {
  backendApiPathPrefixSegment,
  bffErrorMessages,
  commonUiTexts,
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
import { isSameOriginRequest } from "@/lib/server/bff-request"
import { HttpMethod } from "@/lib/types"

interface ApiProxyRouteContext {
  params: Promise<{ apiPath: string[] }>
}

const pathTraversalSegments: ReadonlyArray<string> = Object.freeze([".", ".."])

async function forwardRequestToBackend(
  request: NextRequest,
  { params }: ApiProxyRouteContext
) {
  const isMutationRequest = request.method !== HttpMethod.Get
  if (isMutationRequest && !isSameOriginRequest(request)) {
    return createProblemResponse(
      httpStatusCodes.forbidden,
      bffErrorMessages.crossOriginRequestRejected
    )
  }

  const { apiPath } = await params
  const isSupportedApiPath =
    apiPath[0] === backendApiPathPrefixSegment &&
    apiPath.every(
      (apiPathSegment) => !pathTraversalSegments.includes(apiPathSegment)
    )
  if (!isSupportedApiPath) {
    return createProblemResponse(
      httpStatusCodes.notFound,
      bffErrorMessages.unsupportedApiPath
    )
  }

  const accessToken = request.cookies.get(cookieNames.accessToken)?.value
  if (accessToken === undefined) {
    return createProblemResponse(
      httpStatusCodes.unauthorized,
      commonUiTexts.sessionExpiredMessage
    )
  }

  const encodedApiPath = apiPath.map(encodeURIComponent).join("/")
  const requestBodyText = isMutationRequest ? await request.text() : ""
  let backendResponse: Response
  try {
    backendResponse = await fetch(
      `${getServerApiBaseUrl()}/${encodedApiPath}${request.nextUrl.search}`,
      {
        method: request.method,
        headers: createBackendRequestHeaders(request.headers, accessToken),
        body: requestBodyText === "" ? undefined : requestBodyText,
        cache: "no-store",
      }
    )
  } catch (error) {
    console.error(`Не вдалося виконати запит до /${encodedApiPath}:`, error)
    return createProblemResponse(
      httpStatusCodes.serviceUnavailable,
      commonUiTexts.serverUnavailableMessage
    )
  }
  return createPassThroughResponse(backendResponse)
}

export const GET = forwardRequestToBackend
export const POST = forwardRequestToBackend
export const PUT = forwardRequestToBackend
export const DELETE = forwardRequestToBackend
