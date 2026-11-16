import { apiEndpoints, httpStatusCodes } from "@/lib/constants"
import { parseApiResponseBody } from "@/lib/api-response-body"
import { postToBackend } from "@/lib/server/backend-api"
import { sessionResponseSchema } from "@/lib/schemas/session-response-schema"
import { SessionRefreshResult, SessionRefreshStatus } from "@/lib/types"

export async function refreshBackendSession(
  refreshToken: string,
  incomingRequestHeaders: Headers
): Promise<SessionRefreshResult> {
  let refreshSessionResponse: Response
  try {
    refreshSessionResponse = await postToBackend(
      apiEndpoints.refreshSession,
      incomingRequestHeaders,
      { refreshToken }
    )
  } catch (error) {
    console.error("Не вдалося оновити сесію: сервер недоступний.", error)
    return { status: SessionRefreshStatus.BackendUnavailable }
  }

  if (refreshSessionResponse.status === httpStatusCodes.unauthorized) {
    return { status: SessionRefreshStatus.Rejected }
  }
  if (!refreshSessionResponse.ok) {
    console.error(
      `Не вдалося оновити сесію: сервер відповів статусом ${refreshSessionResponse.status}.`
    )
    return { status: SessionRefreshStatus.BackendUnavailable }
  }

  return {
    status: SessionRefreshStatus.Refreshed,
    session: parseApiResponseBody(
      apiEndpoints.refreshSession,
      await refreshSessionResponse.json(),
      sessionResponseSchema
    ),
  }
}
