import { httpContentTypes, httpHeaderNames } from "@/lib/constants"
import { HttpMethod } from "@/lib/types"

export function getServerApiBaseUrl(): string {
  const serverApiBaseUrl = process.env.API_BASE_URL
  if (!serverApiBaseUrl) {
    throw new Error("Змінна середовища API_BASE_URL не налаштована.")
  }
  return serverApiBaseUrl
}

export function createBackendRequestHeaders(
  incomingRequestHeaders: Headers,
  accessToken: string | null
): Headers {
  const backendRequestHeaders = new Headers({
    [httpHeaderNames.contentType]: httpContentTypes.json,
  })
  const forwardedForHeaderValue = incomingRequestHeaders.get(
    httpHeaderNames.forwardedFor
  )
  if (forwardedForHeaderValue !== null) {
    backendRequestHeaders.set(
      httpHeaderNames.forwardedFor,
      forwardedForHeaderValue
    )
  }
  if (accessToken !== null) {
    backendRequestHeaders.set(
      httpHeaderNames.authorization,
      `Bearer ${accessToken}`
    )
  }
  return backendRequestHeaders
}

export async function postToBackend(
  apiPath: string,
  incomingRequestHeaders: Headers,
  requestBody: object
): Promise<Response> {
  return fetch(`${getServerApiBaseUrl()}${apiPath}`, {
    method: HttpMethod.Post,
    headers: createBackendRequestHeaders(incomingRequestHeaders, null),
    body: JSON.stringify(requestBody),
    cache: "no-store",
  })
}
