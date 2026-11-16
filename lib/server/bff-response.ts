import { NextResponse } from "next/server"
import {
  httpContentTypes,
  httpHeaderNames,
  httpStatusCodes,
} from "@/lib/constants"

export async function createPassThroughResponse(
  backendResponse: Response
): Promise<NextResponse> {
  const backendResponseHeaders = new Headers()
  const backendContentType = backendResponse.headers.get(
    httpHeaderNames.contentType
  )
  if (backendContentType !== null) {
    backendResponseHeaders.set(httpHeaderNames.contentType, backendContentType)
  }
  const isBackendResponseBodyless =
    backendResponse.status === httpStatusCodes.noContent ||
    backendResponse.status === httpStatusCodes.notModified
  return new NextResponse(
    isBackendResponseBodyless ? null : await backendResponse.arrayBuffer(),
    { status: backendResponse.status, headers: backendResponseHeaders }
  )
}

export function createProblemResponse(
  statusCode: number,
  problemDetail: string
): NextResponse {
  return NextResponse.json(
    { status: statusCode, detail: problemDetail },
    {
      status: statusCode,
      headers: { [httpHeaderNames.contentType]: httpContentTypes.problemJson },
    }
  )
}
