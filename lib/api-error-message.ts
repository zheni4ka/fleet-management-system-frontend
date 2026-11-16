import { apiProblemTypeSchema } from "@/lib/schemas/api-problem-type-schema"
import { ApiProblemDetails } from "@/lib/types"

export async function getApiProblemType(
  response: Response
): Promise<string | null> {
  try {
    const problemTypeParseResult = apiProblemTypeSchema.safeParse(
      JSON.parse(await response.text())
    )
    if (!problemTypeParseResult.success) {
      return null
    }
    return problemTypeParseResult.data.type ?? null
  } catch {
    return null
  }
}

function getProblemDetailsMessage(
  problemDetails: ApiProblemDetails
): string | null {
  const validationErrorMessages = Object.values(
    problemDetails.errors ?? {}
  ).flat()
  if (validationErrorMessages.length > 0) {
    return validationErrorMessages.join(" ")
  }
  return (
    problemDetails.detail ||
    problemDetails.message ||
    problemDetails.title ||
    null
  )
}

export async function getApiErrorMessage(
  response: Response,
  fallbackErrorMessage = `Помилка сервера: ${response.status}`
): Promise<string> {
  const responseText = await response.text()
  if (!responseText) {
    return fallbackErrorMessage
  }

  try {
    const problemDetails: ApiProblemDetails = JSON.parse(responseText)
    return getProblemDetailsMessage(problemDetails) ?? fallbackErrorMessage
  } catch {
    return responseText
  }
}
