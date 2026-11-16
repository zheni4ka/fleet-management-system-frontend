import { localeCodes } from "@/lib/constants"

const localDateTimeInputPattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/

function getTimeZoneOffsetMilliseconds(
  utcMilliseconds: number,
  timeZoneId: string
): number {
  const zonedDateTimeParts = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZoneId,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMilliseconds))
  const getZonedDateTimePartNumber = (
    zonedDateTimePartType: Intl.DateTimeFormatPartTypes
  ): number => {
    const zonedDateTimePart = zonedDateTimeParts.find(
      (dateTimePart) => dateTimePart.type === zonedDateTimePartType
    )
    if (zonedDateTimePart === undefined) {
      throw new Error(
        `Часовий пояс ${timeZoneId} не повернув частину дати "${zonedDateTimePartType}".`
      )
    }
    return Number(zonedDateTimePart.value)
  }
  const zonedWallClockAsUtcMilliseconds = Date.UTC(
    getZonedDateTimePartNumber("year"),
    getZonedDateTimePartNumber("month") - 1,
    getZonedDateTimePartNumber("day"),
    getZonedDateTimePartNumber("hour"),
    getZonedDateTimePartNumber("minute"),
    getZonedDateTimePartNumber("second")
  )
  return zonedWallClockAsUtcMilliseconds - utcMilliseconds
}

export function convertZonedLocalDateTimeToUtcIsoString(
  localDateTime: string,
  timeZoneId: string
): string {
  const localDateTimeMatch = localDateTimeInputPattern.exec(localDateTime)
  if (localDateTimeMatch === null) {
    throw new Error(
      `Некоректний локальний час "${localDateTime}": очікується формат РРРР-ММ-ДДTгг:хх.`
    )
  }
  const [, yearText, monthText, dayText, hourText, minuteText] =
    localDateTimeMatch
  const wallClockAsUtcMilliseconds = Date.UTC(
    Number(yearText),
    Number(monthText) - 1,
    Number(dayText),
    Number(hourText),
    Number(minuteText)
  )
  const firstOffsetMilliseconds = getTimeZoneOffsetMilliseconds(
    wallClockAsUtcMilliseconds,
    timeZoneId
  )
  const correctedOffsetMilliseconds = getTimeZoneOffsetMilliseconds(
    wallClockAsUtcMilliseconds - firstOffsetMilliseconds,
    timeZoneId
  )
  return new Date(
    wallClockAsUtcMilliseconds - correctedOffsetMilliseconds
  ).toISOString()
}

export function formatUtcDateTimeInTimeZone(
  utcIsoDateTime: string,
  timeZoneId: string
): string {
  return new Intl.DateTimeFormat(localeCodes.display, {
    timeZone: timeZoneId,
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(utcIsoDateTime))
}

export function formatUtcDateTimeWithTimeZone(
  utcIsoDateTime: string,
  timeZoneId: string
): string {
  return `${formatUtcDateTimeInTimeZone(utcIsoDateTime, timeZoneId)} (${timeZoneId})`
}
