import { z } from "zod"
import { auditLogSchema } from "@/lib/schemas/audit-log-schema"

export type AuditLog = z.infer<typeof auditLogSchema>
