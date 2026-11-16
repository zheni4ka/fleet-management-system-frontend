import type { NextRequest } from "next/server"
import { apiEndpoints } from "@/lib/constants"
import { changePasswordRequestSchema } from "@/lib/schemas/change-password-request-schema"
import { establishBackendSession } from "@/lib/server/session-route-handlers"

export async function POST(request: NextRequest) {
  return establishBackendSession(
    request,
    apiEndpoints.changePassword,
    changePasswordRequestSchema
  )
}
