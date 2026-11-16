import { getTraceIdFromTraceparent } from "@/lib/trace-context"
import { BffLogEntry } from "@/lib/types"

function createBffLogLine(bffLogEntry: BffLogEntry, level: string): string {
  return JSON.stringify({
    time: new Date().toISOString(),
    level,
    message: bffLogEntry.message,
    traceId:
      bffLogEntry.traceparent === null
        ? null
        : getTraceIdFromTraceparent(bffLogEntry.traceparent),
    method: bffLogEntry.method,
    path: bffLogEntry.path,
    status: bffLogEntry.status,
  })
}

export function logBffInformation(bffLogEntry: BffLogEntry): void {
  console.info(createBffLogLine(bffLogEntry, "Information"))
}

export function logBffError(bffLogEntry: BffLogEntry, error: unknown): void {
  console.error(createBffLogLine(bffLogEntry, "Error"), error)
}
