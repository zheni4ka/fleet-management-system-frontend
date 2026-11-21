import { ApiFieldErrorMessages } from "@/lib/types"

export class ApiRequestFailedError extends Error {
  readonly responseStatus: number
  readonly problemMessage: string | null
  readonly apiFieldErrorMessages: ApiFieldErrorMessages

  constructor(
    responseStatus: number,
    problemMessage: string | null,
    apiFieldErrorMessages: ApiFieldErrorMessages
  ) {
    super(problemMessage ?? `API request failed with status ${responseStatus}.`)
    this.name = "ApiRequestFailedError"
    this.responseStatus = responseStatus
    this.problemMessage = problemMessage
    this.apiFieldErrorMessages = apiFieldErrorMessages
  }
}
