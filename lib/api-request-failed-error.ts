export class ApiRequestFailedError extends Error {
  readonly responseStatus: number
  readonly problemMessage: string | null

  constructor(responseStatus: number, problemMessage: string | null) {
    super(problemMessage ?? `API request failed with status ${responseStatus}.`)
    this.name = "ApiRequestFailedError"
    this.responseStatus = responseStatus
    this.problemMessage = problemMessage
  }
}
