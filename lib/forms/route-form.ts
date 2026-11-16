import { routeFormValidationMessages } from "@/lib/constants"
import {
  AddRouteFormValues,
  CreateRouteRequestModel,
  RouteAssignmentFormValues,
  RouteStatus,
} from "@/lib/types"

export function createEmptyAddRouteFormValues(): AddRouteFormValues {
  return {
    startLocationId: "",
    destinationLocationId: "",
    departureTime: "",
    arrivalTime: "",
    autoId: "",
    driverId: "",
    status: RouteStatus.Planned,
  }
}

export function getRouteAssignmentFormValidationError(
  routeAssignmentFormValues: RouteAssignmentFormValues
): string | null {
  const hasEmptyRequiredField = [
    routeAssignmentFormValues.startLocationId,
    routeAssignmentFormValues.destinationLocationId,
    routeAssignmentFormValues.autoId,
    routeAssignmentFormValues.driverId,
  ].some((requiredFieldValue) => requiredFieldValue === "")
  if (hasEmptyRequiredField) {
    return routeFormValidationMessages.requiredFieldsMissing
  }
  if (
    routeAssignmentFormValues.startLocationId ===
    routeAssignmentFormValues.destinationLocationId
  ) {
    return routeFormValidationMessages.sameStartAndDestinationLocation
  }
  return null
}

export function getAddRouteFormValidationError(
  addRouteFormValues: AddRouteFormValues
): string | null {
  if (
    addRouteFormValues.departureTime === "" ||
    addRouteFormValues.arrivalTime === ""
  ) {
    return routeFormValidationMessages.requiredFieldsMissing
  }
  const routeAssignmentFormValidationError =
    getRouteAssignmentFormValidationError(addRouteFormValues)
  if (routeAssignmentFormValidationError !== null) {
    return routeAssignmentFormValidationError
  }
  if (
    new Date(addRouteFormValues.arrivalTime) <=
    new Date(addRouteFormValues.departureTime)
  ) {
    return routeFormValidationMessages.arrivalNotAfterDeparture
  }
  return null
}

export function createCreateRouteRequestModel(
  addRouteFormValues: AddRouteFormValues
): CreateRouteRequestModel {
  return {
    startLocationId: Number(addRouteFormValues.startLocationId),
    destinationLocationId: Number(addRouteFormValues.destinationLocationId),
    departureTime: addRouteFormValues.departureTime,
    arrivalTime: addRouteFormValues.arrivalTime,
    autoId: Number(addRouteFormValues.autoId),
    driverId: Number(addRouteFormValues.driverId),
    status: addRouteFormValues.status,
  }
}
