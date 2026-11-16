import { SessionRefreshStatus } from "@/lib/types/session-refresh-status"
import { SessionResponse } from "@/lib/types/session-response"

export type SessionRefreshResult =
  | { status: SessionRefreshStatus.Refreshed; session: SessionResponse }
  | { status: SessionRefreshStatus.Rejected }
  | { status: SessionRefreshStatus.BackendUnavailable }
