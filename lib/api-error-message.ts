import { apiProblemTypeSchema } from "@/lib/schemas/api-problem-type-schema"
import { ApiFieldErrorMessages, ApiProblemDetails } from "@/lib/types"

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

interface ApiProblem {
  problemMessage: string | null
  apiFieldErrorMessages: ApiFieldErrorMessages
}

export async function getApiProblem(response: Response): Promise<ApiProblem> {
  const responseText = await response.text()
  if (!responseText) {
    return { problemMessage: null, apiFieldErrorMessages: {} }
  }

  try {
    const problemDetails: ApiProblemDetails = JSON.parse(responseText)
    return {
      problemMessage: getProblemDetailsMessage(problemDetails),
      apiFieldErrorMessages: problemDetails.errors ?? {},
    }
  } catch {
    return { problemMessage: responseText, apiFieldErrorMessages: {} }
  }
}

export async function getApiProblemMessage(
  response: Response
): Promise<string | null> {
  return (await getApiProblem(response)).problemMessage
}

export async function getApiErrorMessage(
  response: Response,
  fallbackErrorMessage: string
): Promise<string> {
  return (await getApiProblemMessage(response)) ?? fallbackErrorMessage
}
