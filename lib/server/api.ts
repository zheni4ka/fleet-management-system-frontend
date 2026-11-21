import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { z } from "zod"
import {
  appRoutes,
  cookieNames,
  httpHeaderNames,
  httpStatusCodes,
} from "@/lib/constants"
import { getApiErrorMessage } from "@/lib/api-error-message"
import { parseApiResponseBody } from "@/lib/api-response-body"
import { hasAuthTokenUserRole } from "@/lib/auth-token"
import { createLoginPath } from "@/lib/login-redirect"
import {
  createBackendRequestHeaders,
  createBackendRequestTimeoutSignal,
  getServerApiBaseUrl,
} from "@/lib/server/backend-api"
import { logBffError } from "@/lib/server/bff-logger"
import {
  ApiFetchResult,
  HttpMethod,
  LoginRedirectReason,
  UserRole,
} from "@/lib/types"

export async function getAuthTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(cookieNames.accessToken)?.value ?? null
}

export async function getAuthTokenOrRedirect(): Promise<string> {
  const authToken = await getAuthTokenFromCookies()
  if (authToken === null) {
    redirect(appRoutes.login)
  }
  return authToken
}

export async function getAdminAuthTokenOrRedirect(): Promise<string> {
  const authToken = await getAuthTokenOrRedirect()
  if (!hasAuthTokenUserRole(authToken, UserRole.Admin)) {
    redirect(appRoutes.home)
  }
  return authToken
}

export async function fetchFromApi<TResponseSchema extends z.ZodType>(
  apiPath: string,
  authToken: string,
  responseSchema: TResponseSchema
): Promise<ApiFetchResult<z.infer<TResponseSchema>>> {
  const incomingRequestHeaders = await headers()
  const commonTranslations = await getTranslations("common")
  let response: Response
  try {
    response = await fetch(`${getServerApiBaseUrl()}${apiPath}`, {
      headers: createBackendRequestHeaders(incomingRequestHeaders, authToken),
      cache: "no-store",
      signal: createBackendRequestTimeoutSignal(),
    })
  } catch (error) {
    logBffError(
      {
        message: "Server-rendered API request failed: backend unreachable",
        traceparent: incomingRequestHeaders.get(httpHeaderNames.traceparent),
        method: HttpMethod.Get,
        path: apiPath,
        status: null,
      },
      error
    )
    return {
      isSucceeded: false,
      errorMessage: commonTranslations("serverUnavailableMessage"),
    }
  }

  if (response.status === httpStatusCodes.unauthorized) {
    redirect(createLoginPath(null, LoginRedirectReason.SessionExpired))
  }
  if (!response.ok) {
    return {
      isSucceeded: false,
      errorMessage: await getApiErrorMessage(
        response,
        commonTranslations("dataLoadFailedMessage", {
          status: response.status,
        })
      ),
    }
  }
  return {
    isSucceeded: true,
    data: parseApiResponseBody(apiPath, await response.json(), responseSchema),
  }
}

export function getFirstApiFetchErrorMessage(
  apiFetchResults: ReadonlyArray<ApiFetchResult<unknown>>
): string {
  for (const apiFetchResult of apiFetchResults) {
    if (!apiFetchResult.isSucceeded) {
      return apiFetchResult.errorMessage
    }
  }
  throw new Error("None of the API fetch results contains an error.")
}
