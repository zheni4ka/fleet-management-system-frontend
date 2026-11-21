import { getRequiredFieldErrors } from "@/lib/forms/form-field-errors"
import { convertZonedLocalDateTimeToUtcIsoString } from "@/lib/zoned-date-time"
import { getIsSameRouteCity } from "@/lib/forms/route-city-selection"
import {
  AddRouteFormValues,
  CreateRouteRequestModel,
  FormFieldErrors,
  FormValidationError,
  RouteAddressRequestFields,
  RouteAddressSelection,
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
    startAddress: null,
    destinationCity: null,
    destinationAddress: null,
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
  const {
    startCity,
    startAddress,
    destinationCity,
    destinationAddress,
    autoId,
    driverId,
  } = routeAssignmentFormValues
  const isSameRouteCity =
    startCity !== null &&
    destinationCity !== null &&
    getIsSameRouteCity(startCity, destinationCity)
  const routeAssignmentFormFieldErrors: FormFieldErrors<
    keyof RouteScheduleFormValues
  > = Object.fromEntries(
    [
      ["startCity", startCity === null],
      ["startAddress", startAddress === null],
      ["destinationCity", destinationCity === null],
      ["destinationAddress", destinationAddress === null],
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

function getRequiredRouteAddress(
  routeAddress: RouteAddressSelection | null
): RouteAddressSelection {
  if (routeAddress === null) {
    throw new Error("Route address must be selected before creating a route.")
  }
  return routeAddress
}

export function createRouteAddressRequestFields(
  routeAssignmentFormValues: RouteAssignmentFormValues
): RouteAddressRequestFields {
  const { startAddress, destinationAddress } = routeAssignmentFormValues
  return {
    startAddressLine: startAddress?.addressLine ?? null,
    startAddressLatitude: startAddress?.latitude ?? null,
    startAddressLongitude: startAddress?.longitude ?? null,
    destinationAddressLine: destinationAddress?.addressLine ?? null,
    destinationAddressLatitude: destinationAddress?.latitude ?? null,
    destinationAddressLongitude: destinationAddress?.longitude ?? null,
  }
}

function createRequiredRouteAddressRequestFields(
  routeAssignmentFormValues: RouteAssignmentFormValues
): RouteAddressRequestFields {
  const startAddress = getRequiredRouteAddress(
    routeAssignmentFormValues.startAddress
  )
  const destinationAddress = getRequiredRouteAddress(
    routeAssignmentFormValues.destinationAddress
  )
  return {
    startAddressLine: startAddress.addressLine,
    startAddressLatitude: startAddress.latitude,
    startAddressLongitude: startAddress.longitude,
    destinationAddressLine: destinationAddress.addressLine,
    destinationAddressLatitude: destinationAddress.latitude,
    destinationAddressLongitude: destinationAddress.longitude,
  }
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
    ...createRequiredRouteAddressRequestFields(addRouteFormValues),
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
