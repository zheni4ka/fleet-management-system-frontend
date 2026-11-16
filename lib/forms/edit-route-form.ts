import {
  EditRouteFormValues,
  Route,
  UpdateRouteRequestModel,
} from "@/lib/types"

export function createEditRouteFormValuesFromRoute(
  route: Route
): EditRouteFormValues {
  return {
    startLocationId: String(route.startLocationId),
    destinationLocationId: String(route.destinationLocationId),
    autoId: String(route.autoId),
    driverId: String(route.driverId),
    status: route.status,
  }
}

export function createUpdateRouteRequestModel(
  routeId: number,
  editRouteFormValues: EditRouteFormValues
): UpdateRouteRequestModel {
  return {
    id: routeId,
    startLocationId: Number(editRouteFormValues.startLocationId),
    destinationLocationId: Number(editRouteFormValues.destinationLocationId),
    autoId: Number(editRouteFormValues.autoId),
    driverId: Number(editRouteFormValues.driverId),
    status: editRouteFormValues.status,
  }
}
