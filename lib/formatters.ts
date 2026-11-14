import { displayLocale } from "@/lib/constants"
import { Auto, Driver, Location } from "@/lib/types"

export function formatLocationName(location: Location): string {
  return `${location.city}, ${location.country}`
}

export function formatDriverFullName(driver: Driver): string {
  return `${driver.name} ${driver.surname}`
}

export function formatAutoTitle(auto: Auto): string {
  return `${auto.mark} ${auto.model}`
}

export function formatAutoTitleWithNumber(auto: Auto): string {
  return `${formatAutoTitle(auto)} (${auto.number})`
}

export function formatDateTime(isoDateTime: string): string {
  return new Date(isoDateTime).toLocaleString(displayLocale)
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(displayLocale)
}

export function formatLocalIsoDate(date: Date): string {
  const yearText = String(date.getFullYear())
  const monthText = String(date.getMonth() + 1).padStart(2, "0")
  const dayText = String(date.getDate()).padStart(2, "0")
  return `${yearText}-${monthText}-${dayText}`
}

export function formatHours(hoursCount: number): string {
  return `${hoursCount.toLocaleString(displayLocale)} год`
}

export function formatIsoDateOnly(isoDateOnly: string): string {
  const [yearText, monthText, dayText] = isoDateOnly.split("-")
  if (
    yearText === undefined ||
    monthText === undefined ||
    dayText === undefined
  ) {
    throw new Error(`Некоректний формат дати: "${isoDateOnly}"`)
  }
  return new Date(
    Number(yearText),
    Number(monthText) - 1,
    Number(dayText)
  ).toLocaleDateString(displayLocale)
}
