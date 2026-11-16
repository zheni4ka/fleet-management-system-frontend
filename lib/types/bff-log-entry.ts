export interface BffLogEntry {
  message: string
  traceparent: string | null
  method: string
  path: string
  status: number | null
}
