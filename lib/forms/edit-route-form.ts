import {
  createRouteDestinationCitySelection,
  createRouteStartCitySelection,
} from "@/lib/forms/route-city-selection"
import {
  createRouteAddressRequestFields,
  createRouteTimesUtc,
  getRouteAssignmentFormFieldErrors,
  getRouteScheduleFormFieldErrors,
} from "@/lib/forms/route-form"
import { convertUtcIsoStringToZonedLocalDateTime } from "@/lib/zoned-date-time"
import {
  EditRouteFormValues,
  FormFieldErrors,
  Route,
  RouteAddressSelection,
  RouteLocationIds,
  RouteScheduleFormValues,
  RouteStatus,
  UpdateRouteRequestModel,
} from "@/lib/types"

function createRouteAddressSelection(
  addressLine: string | null,
  addressLatitude: number | null,
  addressLongitude: number | null
): RouteAddressSelection | null {
  return addressLine === null ||
    addressLatitude === null ||
    addressLongitude === null
    ? null
    : { addressLine, latitude: addressLatitude, longitude: addressLongitude }
}

export function canRouteBeRescheduled(route: Route): boolean {
  return route.status === RouteStatus.Planned
}

export function createEditRouteFormValuesFromRoute(
  route: Route
): EditRouteFormValues {
  return {
    startCity: createRouteStartCitySelection(route),
    startAddress: createRouteAddressSelection(
      route.startAddressLine,
      route.startAddressLatitude,
      route.startAddressLongitude
    ),
    destinationCity: createRouteDestinationCitySelection(route),
    destinationAddress: createRouteAddressSelection(
      route.destinationAddressLine,
      route.destinationAddressLatitude,
      route.destinationAddressLongitude
    ),
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

export function getEditRouteFormFieldErrors(
  route: Route,
  editRouteFormValues: EditRouteFormValues
): FormFieldErrors<keyof RouteScheduleFormValues> {
  return canRouteBeRescheduled(route)
    ? getRouteScheduleFormFieldErrors(editRouteFormValues)
    : getRouteAssignmentFormFieldErrors(editRouteFormValues)
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
    ...createRouteAddressRequestFields(editRouteFormValues),
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
