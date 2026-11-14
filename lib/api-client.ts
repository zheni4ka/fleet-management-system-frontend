import { cookieNames } from "@/lib/constants"
import { getApiErrorMessage } from "@/lib/api-error-message"
import { getBrowserCookieValue } from "@/lib/browser-cookies"
import { HttpMethod } from "@/lib/types"

const expiredSessionErrorMessage =
  "Сесія завершилась. Увійдіть у систему повторно."

export function getClientApiBaseUrl(): string {
  const clientApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!clientApiBaseUrl) {
    throw new Error(
      "Змінна середовища NEXT_PUBLIC_API_BASE_URL не налаштована."
    )
  }
  return clientApiBaseUrl
}

function createAuthorizedRequestHeaders(): HeadersInit {
  const authToken = getBrowserCookieValue(cookieNames.authToken)
  if (authToken === null) {
    throw new Error(expiredSessionErrorMessage)
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
    throw new Error(expiredSessionErrorMessage)
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

export async function fetchApiData<TData>(apiPath: string): Promise<TData> {
  const response = await sendAuthorizedRequest(apiPath, HttpMethod.Get)
  return (await response.json()) as TData
}
