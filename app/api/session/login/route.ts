import type { NextRequest } from "next/server"
import { apiEndpoints } from "@/lib/constants"
import { loginRequestSchema } from "@/lib/schemas/login-request-schema"
import { establishBackendSession } from "@/lib/server/session-route-handlers"

export async function POST(request: NextRequest) {
  return establishBackendSession(
    request,
    apiEndpoints.login,
    loginRequestSchema
  )
}
