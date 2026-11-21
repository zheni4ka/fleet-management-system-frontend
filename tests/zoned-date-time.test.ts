import { describe, expect, it } from "vitest"
import {
  convertZonedLocalDateTimeToUtcIsoString,
  formatUtcDateTimeWithTimeZone,
} from "@/lib/zoned-date-time"
import { AppLocale } from "@/lib/types"

describe("convertZonedLocalDateTimeToUtcIsoString", () => {
  it.each([
    ["2026-12-01T08:00", "Europe/Kyiv", "2026-12-01T06:00:00.000Z"],
    ["2026-07-01T20:00", "Europe/Kyiv", "2026-07-01T17:00:00.000Z"],
    ["2026-12-01T08:00", "Europe/Warsaw", "2026-12-01T07:00:00.000Z"],
    ["2026-07-01T08:00", "Europe/Warsaw", "2026-07-01T06:00:00.000Z"],
    ["2026-03-29T12:00", "Europe/Kyiv", "2026-03-29T09:00:00.000Z"],
    ["2026-11-18T14:34:45", "Europe/Kyiv", "2026-11-18T12:34:45.000Z"],
    ["2026-11-18T14:34:45.5", "Europe/Kyiv", "2026-11-18T12:34:45.500Z"],
  ])(
    "converts %s in %s to %s",
    (localDateTime, timeZoneId, expectedUtcIsoString) => {
      expect(
        convertZonedLocalDateTimeToUtcIsoString(localDateTime, timeZoneId)
      ).toBe(expectedUtcIsoString)
    }
  )

  it("rejects values that are not datetime-local input values", () => {
    expect(() =>
      convertZonedLocalDateTimeToUtcIsoString("01.12.2026 08:00", "Europe/Kyiv")
    ).toThrow("РРРР-ММ-ДДTгг:хх")
  })
})

describe("formatUtcDateTimeWithTimeZone", () => {
  it("shows the wall clock of the location and its zone id", () => {
    const formattedDateTime = formatUtcDateTimeWithTimeZone(
      "2026-12-01T06:00:00Z",
      "Europe/Kyiv",
      AppLocale.Ukrainian
    )

    expect(formattedDateTime).toContain("08:00")
    expect(formattedDateTime).toContain("(Europe/Kyiv)")
  })
})
