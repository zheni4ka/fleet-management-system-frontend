import { z } from "zod"
import {
  bffRoutes,
  httpContentTypes,
  httpHeaderNames,
  httpStatusCodes,
} from "@/lib/constants"
import { getApiErrorMessage } from "@/lib/api-error-message"
import { parseApiResponseBody } from "@/lib/api-response-body"
import { createLoginPath } from "@/lib/login-redirect"
import { SessionExpiredError } from "@/lib/session-expired-error"
import { HttpMethod, LoginRedirectReason } from "@/lib/types"

function endExpiredSession(): SessionExpiredError {
  const currentPath = `${window.location.pathname}${window.location.search}`
  window.location.assign(
    createLoginPath(currentPath, LoginRedirectReason.SessionExpired)
  )
  return new SessionExpiredError()
}

async function sendProxiedApiRequest(
  apiPath: string,
  httpMethod: HttpMethod,
  requestBody?: object
): Promise<Response> {
  const response = await fetch(`${bffRoutes.apiProxy}${apiPath}`, {
    method: httpMethod,
    headers:
      requestBody === undefined
        ? undefined
        : { [httpHeaderNames.contentType]: httpContentTypes.json },
    body: requestBody === undefined ? undefined : JSON.stringify(requestBody),
  })

  if (response.status === httpStatusCodes.unauthorized) {
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
  await sendProxiedApiRequest(apiPath, httpMethod, requestBody)
}

export async function sendApiRequestForData<
  TResponseSchema extends z.ZodType,
>(
  apiPath: string,
  httpMethod: HttpMethod,
  requestBody: object,
  responseSchema: TResponseSchema
): Promise<z.infer<TResponseSchema>> {
  const response = await sendProxiedApiRequest(apiPath, httpMethod, requestBody)
  return parseApiResponseBody(apiPath, await response.json(), responseSchema)
}

export async function fetchApiData<TResponseSchema extends z.ZodType>(
  apiPath: string,
  responseSchema: TResponseSchema
): Promise<z.infer<TResponseSchema>> {
  const response = await sendProxiedApiRequest(apiPath, HttpMethod.Get)
  return parseApiResponseBody(apiPath, await response.json(), responseSchema)
}
