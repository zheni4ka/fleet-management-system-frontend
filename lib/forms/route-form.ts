import { getRequiredFieldErrors } from "@/lib/forms/form-field-errors"
import { convertZonedLocalDateTimeToUtcIsoString } from "@/lib/zoned-date-time"
import { getIsSameRouteCity } from "@/lib/forms/route-city-selection"
import {
  AddRouteFormValues,
  CreateRouteRequestModel,
  FormFieldErrors,
  FormValidationError,
  RouteAssignmentFormValues,
  RouteCitySelection,
  RouteLocationIds,
  RouteScheduleFormValues,
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

export function getRouteAssignmentFormFieldErrors(
  routeAssignmentFormValues: RouteAssignmentFormValues
): FormFieldErrors<keyof RouteScheduleFormValues> {
  const { startCity, destinationCity, autoId, driverId } =
    routeAssignmentFormValues
  const isSameRouteCity =
    startCity !== null &&
    destinationCity !== null &&
    getIsSameRouteCity(startCity, destinationCity)
  const routeAssignmentFormFieldErrors: FormFieldErrors<
    keyof RouteScheduleFormValues
  > = Object.fromEntries(
    [
      ["startCity", startCity === null],
      ["destinationCity", destinationCity === null],
      ["autoId", autoId === ""],
      ["driverId", driverId === ""],
    ]
      .filter(([, isFieldEmpty]) => isFieldEmpty)
      .map(([formFieldName]) => [
        formFieldName,
        FormValidationError.RequiredFieldMissing,
      ])
  )
  return isSameRouteCity
    ? {
        ...routeAssignmentFormFieldErrors,
        destinationCity: FormValidationError.SameStartAndDestinationLocation,
      }
    : routeAssignmentFormFieldErrors
}

function getRequiredRouteCity(
  routeCity: RouteCitySelection | null
): RouteCitySelection {
  if (routeCity === null) {
    throw new Error("Route city must be selected before converting times.")
  }
  return routeCity
}

export function createRouteTimesUtc(
  routeScheduleFormValues: RouteScheduleFormValues
): RouteTimesUtc {
  return {
    departureTimeUtc: convertZonedLocalDateTimeToUtcIsoString(
      routeScheduleFormValues.departureLocalDateTime,
      getRequiredRouteCity(routeScheduleFormValues.startCity).timeZoneId
    ),
    arrivalTimeUtc: convertZonedLocalDateTimeToUtcIsoString(
      routeScheduleFormValues.arrivalLocalDateTime,
      getRequiredRouteCity(routeScheduleFormValues.destinationCity).timeZoneId
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

export function getRouteScheduleFormFieldErrors(
  routeScheduleFormValues: RouteScheduleFormValues
): FormFieldErrors<keyof RouteScheduleFormValues> {
  const routeScheduleFormFieldErrors = {
    ...getRouteAssignmentFormFieldErrors(routeScheduleFormValues),
    ...getRequiredFieldErrors(routeScheduleFormValues, [
      "departureLocalDateTime",
      "arrivalLocalDateTime",
    ]),
  }
  const canCompareRouteTimes =
    routeScheduleFormValues.startCity !== null &&
    routeScheduleFormValues.destinationCity !== null &&
    routeScheduleFormValues.departureLocalDateTime !== "" &&
    routeScheduleFormValues.arrivalLocalDateTime !== ""
  if (!canCompareRouteTimes) {
    return routeScheduleFormFieldErrors
  }
  const routeTimesUtc = createRouteTimesUtc(routeScheduleFormValues)
  return new Date(routeTimesUtc.arrivalTimeUtc) <=
    new Date(routeTimesUtc.departureTimeUtc)
    ? {
        ...routeScheduleFormFieldErrors,
        arrivalLocalDateTime: FormValidationError.ArrivalNotAfterDeparture,
      }
    : routeScheduleFormFieldErrors
}
