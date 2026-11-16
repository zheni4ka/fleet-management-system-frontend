import { traceContextFormat } from "@/lib/constants"

function createRandomHexValue(byteLength: number): string {
  return Array.from(
    crypto.getRandomValues(new Uint8Array(byteLength)),
    (randomByte) => randomByte.toString(16).padStart(2, "0")
  ).join("")
}

export function createTraceparent(): string {
  return [
    traceContextFormat.version,
    createRandomHexValue(traceContextFormat.traceIdByteLength),
    createRandomHexValue(traceContextFormat.parentIdByteLength),
    traceContextFormat.sampledTraceFlags,
  ].join("-")
}

export function getTraceIdFromTraceparent(traceparent: string): string | null {
  const traceparentMatch =
    traceContextFormat.traceparentPattern.exec(traceparent)
  return traceparentMatch === null ? null : traceparentMatch[1]
}
