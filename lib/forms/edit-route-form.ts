import {
  createRouteDestinationCitySelection,
  createRouteStartCitySelection,
} from "@/lib/forms/route-city-selection"
import {
  EditRouteFormValues,
  Route,
  RouteLocationIds,
  UpdateRouteRequestModel,
} from "@/lib/types"

export function createEditRouteFormValuesFromRoute(
  route: Route
): EditRouteFormValues {
  return {
    startCity: createRouteStartCitySelection(route),
    destinationCity: createRouteDestinationCitySelection(route),
    autoId: String(route.autoId),
    driverId: String(route.driverId),
    status: route.status,
  }
}

export function createUpdateRouteRequestModel(
  route: Route,
  editRouteFormValues: EditRouteFormValues,
  routeLocationIds: RouteLocationIds
): UpdateRouteRequestModel {
  return {
    id: route.id,
    rowVersion: route.rowVersion,
    ...routeLocationIds,
    autoId: Number(editRouteFormValues.autoId),
    driverId: Number(editRouteFormValues.driverId),
    status: editRouteFormValues.status,
  }
}

export function createRouteLocationIdsFromRoute(
  route: Route
): RouteLocationIds {
  return {
    startLocationId: route.startLocationId,
    destinationLocationId: route.destinationLocationId,
  }
}
