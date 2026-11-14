import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { appRoutes, cookieNames } from "@/lib/constants"
import { getApiErrorMessage } from "@/lib/api-error-message"
import { hasAuthTokenUserRole } from "@/lib/auth-token"
import { createLoginPath } from "@/lib/login-redirect"
import { ApiFetchResult, LoginRedirectReason, UserRole } from "@/lib/types"

function getServerApiBaseUrl(): string {
  const serverApiBaseUrl = process.env.API_BASE_URL
  if (!serverApiBaseUrl) {
    throw new Error("Змінна середовища API_BASE_URL не налаштована.")
  }
  return serverApiBaseUrl
}

export async function getAuthTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(cookieNames.authToken)?.value ?? null
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

export async function fetchFromApi<TData>(
  apiPath: string,
  authToken: string
): Promise<ApiFetchResult<TData>> {
  let response: Response
  try {
    response = await fetch(`${getServerApiBaseUrl()}${apiPath}`, {
      headers: { Authorization: `Bearer ${authToken}` },
      cache: "no-store",
    })
  } catch (error) {
    console.error(`Не вдалося виконати запит до ${apiPath}:`, error)
    return {
      isSucceeded: false,
      errorMessage: "Сервер недоступний. Спробуйте пізніше.",
    }
  }

  if (response.status === 401) {
    redirect(createLoginPath(null, LoginRedirectReason.SessionExpired))
  }
  if (!response.ok) {
    return {
      isSucceeded: false,
      errorMessage: await getApiErrorMessage(
        response,
        `Помилка завантаження даних (Статус: ${response.status})`
      ),
    }
  }
  return { isSucceeded: true, data: (await response.json()) as TData }
}

export function getFirstApiFetchErrorMessage(
  apiFetchResults: ReadonlyArray<ApiFetchResult<unknown>>
): string {
  for (const apiFetchResult of apiFetchResults) {
    if (!apiFetchResult.isSucceeded) {
      return apiFetchResult.errorMessage
    }
  }
  throw new Error("Серед результатів запитів немає жодної помилки.")
}
