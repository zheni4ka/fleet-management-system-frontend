import { z } from "zod"
import { sessionResponseSchema } from "@/lib/schemas/session-response-schema"

export type SessionResponse = z.infer<typeof sessionResponseSchema>
