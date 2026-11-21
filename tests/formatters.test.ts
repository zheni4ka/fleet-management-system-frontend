import { describe, expect, it } from "vitest"
import { formatUtcIntervalHours } from "@/lib/formatters"
import { AppLocale } from "@/lib/types"

describe("formatUtcIntervalHours", () => {
  it("rounds the interval to a tenth of an hour", () => {
    expect(
      formatUtcIntervalHours(
        "2026-12-01T06:00:00Z",
        "2026-12-01T17:20:00Z",
        AppLocale.English
      )
    ).toBe("11.3 hrs")
  })

  it("formats an interval shorter than an hour", () => {
    expect(
      formatUtcIntervalHours(
        "2026-11-21T04:07:00Z",
        "2026-11-21T04:07:30Z",
        AppLocale.English
      )
    ).toBe("0 hrs")
  })
})
