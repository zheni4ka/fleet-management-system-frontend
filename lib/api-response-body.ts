import { z } from "zod"
import { commonUiTexts } from "@/lib/constants"

export function parseApiResponseBody<TResponseSchema extends z.ZodType>(
  apiPath: string,
  responseBody: unknown,
  responseSchema: TResponseSchema
): z.infer<TResponseSchema> {
  const responseBodyParseResult = responseSchema.safeParse(responseBody)
  if (!responseBodyParseResult.success) {
    console.error(
      `Відповідь ${apiPath} не відповідає очікуваній схемі:`,
      responseBodyParseResult.error.issues
    )
    throw new Error(commonUiTexts.unexpectedApiResponseFormatMessage, {
      cause: responseBodyParseResult.error,
    })
  }
  return responseBodyParseResult.data
}
