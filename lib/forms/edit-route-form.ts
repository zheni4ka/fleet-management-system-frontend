import {
  createRouteDestinationCitySelection,
  createRouteStartCitySelection,
} from "@/lib/forms/route-city-selection"
import {
  createRouteTimesUtc,
  getRouteAssignmentFormValidationError,
  getRouteScheduleFormValidationError,
} from "@/lib/forms/route-form"
import { convertUtcIsoStringToZonedLocalDateTime } from "@/lib/zoned-date-time"
import {
  EditRouteFormValues,
  FormValidationError,
  Route,
  RouteLocationIds,
  RouteStatus,
  UpdateRouteRequestModel,
} from "@/lib/types"

export function canRouteBeRescheduled(route: Route): boolean {
  return route.status === RouteStatus.Planned
}

export function createEditRouteFormValuesFromRoute(
  route: Route
): EditRouteFormValues {
  return {
    startCity: createRouteStartCitySelection(route),
    destinationCity: createRouteDestinationCitySelection(route),
    departureLocalDateTime: convertUtcIsoStringToZonedLocalDateTime(
      route.departureTimeUtc,
      route.startLocationTimeZoneId
    ),
    arrivalLocalDateTime: convertUtcIsoStringToZonedLocalDateTime(
      route.arrivalTimeUtc,
      route.destinationLocationTimeZoneId
    ),
    autoId: String(route.autoId),
    driverId: String(route.driverId),
    status: route.status,
  }
}

export function getEditRouteFormValidationError(
  route: Route,
  editRouteFormValues: EditRouteFormValues
): FormValidationError | null {
  return canRouteBeRescheduled(route)
    ? getRouteScheduleFormValidationError(editRouteFormValues)
    : getRouteAssignmentFormValidationError(editRouteFormValues)
}

export function createUpdateRouteRequestModel(
  route: Route,
  editRouteFormValues: EditRouteFormValues,
  routeLocationIds: RouteLocationIds
): UpdateRouteRequestModel {
  const routeTimesUtc = canRouteBeRescheduled(route)
    ? createRouteTimesUtc(editRouteFormValues)
    : { departureTimeUtc: null, arrivalTimeUtc: null }
  return {
    id: route.id,
    rowVersion: route.rowVersion,
    ...routeLocationIds,
    ...routeTimesUtc,
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
