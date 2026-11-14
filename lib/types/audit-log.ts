import { AuditAction } from "./audit-action"

export interface AuditLog {
  id: number
  dispatcherId: string | null
  dispatcherUsername: string | null
  time: string
  action: AuditAction
  entityId: string | null
}
