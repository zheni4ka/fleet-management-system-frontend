import { localeCodes } from "@/lib/constants"
import { Auto, Depot, Driver, Location, Route } from "@/lib/types"

export function formatLocationName(
  location: Pick<Location, "city" | "country">
): string {
  return `${location.city}, ${location.country}`
}

export function formatDriverFullName(
  driver: Pick<Driver, "name" | "surname">
): string {
  return `${driver.name} ${driver.surname}`
}

export function formatAutoTitle(auto: Pick<Auto, "mark" | "model">): string {
  return `${auto.mark} ${auto.model}`
}

export function formatAutoTitleWithNumber(
  auto: Pick<Auto, "mark" | "model" | "number">
): string {
  return `${formatAutoTitle(auto)} (${auto.number})`
}

export function formatRouteStartLocationName(route: Route): string {
  return formatLocationName({
    city: route.startLocationCity,
    country: route.startLocationCountry,
  })
}

export function formatRouteDestinationLocationName(route: Route): string {
  return formatLocationName({
    city: route.destinationLocationCity,
    country: route.destinationLocationCountry,
  })
}

export function formatRouteAutoTitleWithNumber(route: Route): string {
  return formatAutoTitleWithNumber({
    mark: route.autoMark,
    model: route.autoModel,
    number: route.autoNumber,
  })
}

export function formatRouteDriverFullName(route: Route): string {
  return formatDriverFullName({
    name: route.driverName,
    surname: route.driverSurname,
  })
}

export function formatDateTime(isoDateTime: string): string {
  return new Date(isoDateTime).toLocaleString(localeCodes.display)
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(localeCodes.display)
}

export function formatLocalIsoDate(date: Date): string {
  const yearText = String(date.getFullYear())
  const monthText = String(date.getMonth() + 1).padStart(2, "0")
  const dayText = String(date.getDate()).padStart(2, "0")
  return `${yearText}-${monthText}-${dayText}`
}

export function formatHours(hoursCount: number): string {
  return `${hoursCount.toLocaleString(localeCodes.display)} год`
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
  ).toLocaleDateString(localeCodes.display)
}

export function formatDepotNames(
  depotIds: ReadonlyArray<number>,
  depots: ReadonlyArray<Depot>
): string {
  return depotIds
    .map((depotId) => {
      const matchingDepot = depots.find((depot) => depot.id === depotId)
      if (matchingDepot === undefined) {
        throw new Error(
          `Депо з ідентифікатором ${depotId} відсутнє у списку депо.`
        )
      }
      return matchingDepot.name
    })
    .join(", ")
}
