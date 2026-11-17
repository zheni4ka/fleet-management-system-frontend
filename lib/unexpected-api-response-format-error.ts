export class UnexpectedApiResponseFormatError extends Error {
  constructor(apiPath: string, options: ErrorOptions) {
    super(
      `The response of ${apiPath} does not match the expected schema.`,
      options
    )
    this.name = "UnexpectedApiResponseFormatError"
  }
}
