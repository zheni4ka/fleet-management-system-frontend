import { z } from "zod"
import { cookieNames } from "@/lib/constants"
import { getApiErrorMessage } from "@/lib/api-error-message"
import { parseApiResponseBody } from "@/lib/api-response-body"
import {
  deleteBrowserCookie,
  getBrowserCookieValue,
} from "@/lib/browser-cookies"
import { createLoginPath } from "@/lib/login-redirect"
import { SessionExpiredError } from "@/lib/session-expired-error"
import { HttpMethod, LoginRedirectReason } from "@/lib/types"

export function getClientApiBaseUrl(): string {
  const clientApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!clientApiBaseUrl) {
    throw new Error(
      "Змінна середовища NEXT_PUBLIC_API_BASE_URL не налаштована."
    )
  }
  return clientApiBaseUrl
}

function endExpiredSession(): SessionExpiredError {
  deleteBrowserCookie(cookieNames.authToken)
  const currentPath = `${window.location.pathname}${window.location.search}`
  window.location.assign(
    createLoginPath(currentPath, LoginRedirectReason.SessionExpired)
  )
  return new SessionExpiredError()
}

function createAuthorizedRequestHeaders(): HeadersInit {
  const authToken = getBrowserCookieValue(cookieNames.authToken)
  if (authToken === null) {
    throw endExpiredSession()
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  }
}

async function sendAuthorizedRequest(
  apiPath: string,
  httpMethod: HttpMethod,
  requestBody?: object
): Promise<Response> {
  const response = await fetch(`${getClientApiBaseUrl()}${apiPath}`, {
    method: httpMethod,
    headers: createAuthorizedRequestHeaders(),
    body: requestBody === undefined ? undefined : JSON.stringify(requestBody),
  })

  if (response.status === 401) {
    throw endExpiredSession()
  }
  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response))
  }
  return response
}

export async function sendApiRequest(
  apiPath: string,
  httpMethod: HttpMethod,
  requestBody?: object
): Promise<void> {
  await sendAuthorizedRequest(apiPath, httpMethod, requestBody)
}

export async function fetchApiData<TResponseSchema extends z.ZodType>(
  apiPath: string,
  responseSchema: TResponseSchema
): Promise<z.infer<TResponseSchema>> {
  const response = await sendAuthorizedRequest(apiPath, HttpMethod.Get)
  return parseApiResponseBody(apiPath, await response.json(), responseSchema)
}
