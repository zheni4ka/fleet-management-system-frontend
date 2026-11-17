import { z } from "zod"
import { UnexpectedApiResponseFormatError } from "@/lib/unexpected-api-response-format-error"

export function parseApiResponseBody<TResponseSchema extends z.ZodType>(
  apiPath: string,
  responseBody: unknown,
  responseSchema: TResponseSchema
): z.infer<TResponseSchema> {
  const responseBodyParseResult = responseSchema.safeParse(responseBody)
  if (!responseBodyParseResult.success) {
    throw new UnexpectedApiResponseFormatError(apiPath, {
      cause: responseBodyParseResult.error,
    })
  }
  return responseBodyParseResult.data
}
