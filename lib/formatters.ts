import { intlLocaleCodes, mapCoordinatesFractionDigits } from "@/lib/constants"
import {
  AppLocale,
  Auto,
  Depot,
  Driver,
  Location,
  MapCoordinates,
  Route,
} from "@/lib/types"

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

export function formatMapCoordinates(
  mapCoordinates: MapCoordinates
): string | null {
  if (mapCoordinates.latitude === null || mapCoordinates.longitude === null) {
    return null
  }
  return `${mapCoordinates.latitude.toFixed(mapCoordinatesFractionDigits)}, ${mapCoordinates.longitude.toFixed(mapCoordinatesFractionDigits)}`
}

function createMapPoint(
  mapCoordinates: MapCoordinates,
  locationName: string
): string {
  if (mapCoordinates.latitude === null || mapCoordinates.longitude === null) {
    return locationName
  }
  return `${mapCoordinates.latitude},${mapCoordinates.longitude}`
}

export function createRouteStartMapPoint(route: Route): string {
  return route.startAddressLatitude === null ||
    route.startAddressLongitude === null
    ? createMapPoint(
        {
          latitude: route.startLocationLatitude,
          longitude: route.startLocationLongitude,
        },
        formatRouteStartLocationName(route)
      )
    : createMapPoint(
        {
          latitude: route.startAddressLatitude,
          longitude: route.startAddressLongitude,
        },
        formatRouteStartLocationName(route)
      )
}

export function createRouteDestinationMapPoint(route: Route): string {
  return route.destinationAddressLatitude === null ||
    route.destinationAddressLongitude === null
    ? createMapPoint(
        {
          latitude: route.destinationLocationLatitude,
          longitude: route.destinationLocationLongitude,
        },
        formatRouteDestinationLocationName(route)
      )
    : createMapPoint(
        {
          latitude: route.destinationAddressLatitude,
          longitude: route.destinationAddressLongitude,
        },
        formatRouteDestinationLocationName(route)
      )
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

export function formatDateTime(
  isoDateTime: string,
  appLocale: AppLocale
): string {
  return new Date(isoDateTime).toLocaleString(intlLocaleCodes[appLocale])
}

export function formatDate(isoDate: string, appLocale: AppLocale): string {
  return new Date(isoDate).toLocaleDateString(intlLocaleCodes[appLocale])
}

export function formatLocalIsoDate(date: Date): string {
  const yearText = String(date.getFullYear())
  const monthText = String(date.getMonth() + 1).padStart(2, "0")
  const dayText = String(date.getDate()).padStart(2, "0")
  return `${yearText}-${monthText}-${dayText}`
}

export function formatHours(hoursCount: number, appLocale: AppLocale): string {
  return new Intl.NumberFormat(intlLocaleCodes[appLocale], {
    style: "unit",
    unit: "hour",
    unitDisplay: "short",
  }).format(hoursCount)
}

export function formatIsoDateOnly(
  isoDateOnly: string,
  appLocale: AppLocale
): string {
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
  ).toLocaleDateString(intlLocaleCodes[appLocale])
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

export function formatUtcIntervalHours(
  startUtcIsoDateTime: string,
  endUtcIsoDateTime: string,
  appLocale: AppLocale
): string {
  const intervalHoursCount =
    (new Date(endUtcIsoDateTime).getTime() -
      new Date(startUtcIsoDateTime).getTime()) /
    (60 * 60 * 1000)
  return formatHours(Math.round(intervalHoursCount * 10) / 10, appLocale)
}

export function formatDriverFullNameWithPatronymic(
  driver: Pick<Driver, "name" | "surname" | "patronymic">
): string {
  return `${driver.surname} ${driver.name} ${driver.patronymic}`
}

export function formatDrivingMinutes(
  drivingMinutes: number,
  appLocale: AppLocale
): string {
  return formatHours(Math.round((drivingMinutes / 60) * 10) / 10, appLocale)
}
