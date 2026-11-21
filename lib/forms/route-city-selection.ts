import { CityGeocodingCandidate, Route, RouteCitySelection } from "@/lib/types"

export function createRouteCitySelectionFromCandidate(
  cityCandidate: CityGeocodingCandidate
): RouteCitySelection {
  return {
    locationId: null,
    geoNamesId: cityCandidate.geoNamesId,
    city: cityCandidate.city,
    region: cityCandidate.region,
    country: cityCandidate.country,
    timeZoneId: cityCandidate.timeZoneId,
    latitude: cityCandidate.latitude,
    longitude: cityCandidate.longitude,
  }
}

export function createRouteStartCitySelection(
  route: Route
): RouteCitySelection {
  return {
    locationId: route.startLocationId,
    geoNamesId: null,
    city: route.startLocationCity,
    region: null,
    country: route.startLocationCountry,
    timeZoneId: route.startLocationTimeZoneId,
    latitude: route.startLocationLatitude,
    longitude: route.startLocationLongitude,
  }
}

export function createRouteDestinationCitySelection(
  route: Route
): RouteCitySelection {
  return {
    locationId: route.destinationLocationId,
    geoNamesId: null,
    city: route.destinationLocationCity,
    region: null,
    country: route.destinationLocationCountry,
    timeZoneId: route.destinationLocationTimeZoneId,
    latitude: route.destinationLocationLatitude,
    longitude: route.destinationLocationLongitude,
  }
}

export function getIsSameRouteCity(
  firstRouteCity: RouteCitySelection,
  secondRouteCity: RouteCitySelection
): boolean {
  if (
    firstRouteCity.geoNamesId !== null &&
    secondRouteCity.geoNamesId !== null
  ) {
    return firstRouteCity.geoNamesId === secondRouteCity.geoNamesId
  }
  if (
    firstRouteCity.locationId !== null &&
    secondRouteCity.locationId !== null
  ) {
    return firstRouteCity.locationId === secondRouteCity.locationId
  }
  return false
}

export function formatCityCandidateArea(
  cityCandidate: Pick<CityGeocodingCandidate, "region" | "country">
): string {
  return cityCandidate.region === null
    ? cityCandidate.country
    : `${cityCandidate.region}, ${cityCandidate.country}`
}

export function formatRouteCitySelection(
  routeCity: Pick<RouteCitySelection, "city" | "region" | "country">
): string {
  return [routeCity.city, routeCity.region, routeCity.country]
    .filter((routeCityNamePart) => routeCityNamePart !== null)
    .join(", ")
}
