import type { NextRequest } from "next/server"
import { z } from "zod"
import { httpHeaderNames } from "@/lib/constants"

export function isSameOriginRequest(request: NextRequest): boolean {
  const originHeaderValue = request.headers.get(httpHeaderNames.origin)
  const hostHeaderValue = request.headers.get(httpHeaderNames.host)
  if (originHeaderValue === null || hostHeaderValue === null) {
    return false
  }
  try {
    return new URL(originHeaderValue).host === hostHeaderValue
  } catch {
    return false
  }
}

export async function readValidatedJsonBody<TRequestSchema extends z.ZodType>(
  request: NextRequest,
  requestSchema: TRequestSchema
): Promise<z.infer<TRequestSchema> | null> {
  let requestBody: unknown
  try {
    requestBody = await request.json()
  } catch {
    return null
  }
  const requestBodyParseResult = requestSchema.safeParse(requestBody)
  return requestBodyParseResult.success ? requestBodyParseResult.data : null
}
