import { z } from "zod"
import { AuditAction } from "@/lib/types/audit-action"

export const auditLogSchema = z.object({
  id: z.number().int(),
  dispatcherId: z.string().nullable(),
  dispatcherUsername: z.string().nullable(),
  time: z.string(),
  action: z.enum(AuditAction),
  entityId: z.string().nullable(),
})
