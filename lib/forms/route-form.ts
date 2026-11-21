import { convertZonedLocalDateTimeToUtcIsoString } from "@/lib/zoned-date-time"
import { getIsSameRouteCity } from "@/lib/forms/route-city-selection"
import {
  AddRouteFormValues,
  CreateRouteRequestModel,
  FormValidationError,
  RouteAssignmentFormValues,
  RouteCitySelection,
  RouteLocationIds,
  RouteStatus,
} from "@/lib/types"

interface RouteTimesUtc {
  departureTimeUtc: string
  arrivalTimeUtc: string
}

export function createEmptyAddRouteFormValues(): AddRouteFormValues {
  return {
    startCity: null,
    destinationCity: null,
    departureLocalDateTime: "",
    arrivalLocalDateTime: "",
    autoId: "",
    driverId: "",
    status: RouteStatus.Planned,
  }
}

export function getRouteAssignmentFormValidationError(
  routeAssignmentFormValues: RouteAssignmentFormValues
): FormValidationError | null {
  const { startCity, destinationCity } = routeAssignmentFormValues
  if (
    startCity === null ||
    destinationCity === null ||
    routeAssignmentFormValues.autoId === "" ||
    routeAssignmentFormValues.driverId === ""
  ) {
    return FormValidationError.RouteRequiredFieldsMissing
  }
  if (getIsSameRouteCity(startCity, destinationCity)) {
    return FormValidationError.SameStartAndDestinationLocation
  }
  return null
}

function getRequiredRouteCity(
  routeCity: RouteCitySelection | null
): RouteCitySelection {
  if (routeCity === null) {
    throw new Error("Route city must be selected before converting times.")
  }
  return routeCity
}

function createRouteTimesUtc(
  addRouteFormValues: AddRouteFormValues
): RouteTimesUtc {
  return {
    departureTimeUtc: convertZonedLocalDateTimeToUtcIsoString(
      addRouteFormValues.departureLocalDateTime,
      getRequiredRouteCity(addRouteFormValues.startCity).timeZoneId
    ),
    arrivalTimeUtc: convertZonedLocalDateTimeToUtcIsoString(
      addRouteFormValues.arrivalLocalDateTime,
      getRequiredRouteCity(addRouteFormValues.destinationCity).timeZoneId
    ),
  }
}

export function createCreateRouteRequestModel(
  addRouteFormValues: AddRouteFormValues,
  routeLocationIds: RouteLocationIds
): CreateRouteRequestModel {
  return {
    ...routeLocationIds,
    ...createRouteTimesUtc(addRouteFormValues),
    autoId: Number(addRouteFormValues.autoId),
    driverId: Number(addRouteFormValues.driverId),
    status: addRouteFormValues.status,
  }
}

export function getAddRouteFormValidationError(
  addRouteFormValues: AddRouteFormValues
): FormValidationError | null {
  if (
    addRouteFormValues.departureLocalDateTime === "" ||
    addRouteFormValues.arrivalLocalDateTime === ""
  ) {
    return FormValidationError.RouteRequiredFieldsMissing
  }
  const routeAssignmentFormValidationError =
    getRouteAssignmentFormValidationError(addRouteFormValues)
  if (routeAssignmentFormValidationError !== null) {
    return routeAssignmentFormValidationError
  }
  const routeTimesUtc = createRouteTimesUtc(addRouteFormValues)
  if (
    new Date(routeTimesUtc.arrivalTimeUtc) <=
    new Date(routeTimesUtc.departureTimeUtc)
  ) {
    return FormValidationError.ArrivalNotAfterDeparture
  }
  return null
}
