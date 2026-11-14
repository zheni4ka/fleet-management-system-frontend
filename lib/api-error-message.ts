import { ApiProblemDetails } from "@/lib/types"

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
