import { sendApiRequestForData } from "@/lib/api-client"
import { apiEndpoints } from "@/lib/constants"
import { locationSchema } from "@/lib/schemas/location-schema"
import {
  CreateLocationRequestModel,
  HttpMethod,
  RouteCitySelection,
  RouteLocationIds,
} from "@/lib/types"

async function resolveRouteCityLocationId(
  routeCity: RouteCitySelection
): Promise<number> {
  if (routeCity.locationId !== null) {
    return routeCity.locationId
  }
  if (routeCity.geoNamesId === null) {
    throw new Error(
      `City ${routeCity.city} has neither a location nor a GeoNames id.`
    )
  }
  const ensureCityLocationRequest: CreateLocationRequestModel = {
    geoNamesId: routeCity.geoNamesId,
  }
  const cityLocation = await sendApiRequestForData(
    apiEndpoints.ensureCityLocation,
    HttpMethod.Post,
    locationSchema,
    ensureCityLocationRequest
  )
  return cityLocation.id
}

export async function resolveRouteLocationIds(
  startCity: RouteCitySelection,
  destinationCity: RouteCitySelection
): Promise<RouteLocationIds> {
  const [startLocationId, destinationLocationId] = await Promise.all([
    resolveRouteCityLocationId(startCity),
    resolveRouteCityLocationId(destinationCity),
  ])
  return { startLocationId, destinationLocationId }
}
