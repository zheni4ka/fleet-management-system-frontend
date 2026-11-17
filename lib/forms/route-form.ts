import { convertZonedLocalDateTimeToUtcIsoString } from "@/lib/zoned-date-time"
import {
  AddRouteFormValues,
  CreateRouteRequestModel,
  FormValidationError,
  LocationLookupOption,
  RouteAssignmentFormValues,
  RouteStatus,
} from "@/lib/types"

export function createEmptyAddRouteFormValues(): AddRouteFormValues {
  return {
    startLocationId: "",
    destinationLocationId: "",
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
  const hasEmptyRequiredField = [
    routeAssignmentFormValues.startLocationId,
    routeAssignmentFormValues.destinationLocationId,
    routeAssignmentFormValues.autoId,
    routeAssignmentFormValues.driverId,
  ].some((requiredFieldValue) => requiredFieldValue === "")
  if (hasEmptyRequiredField) {
    return FormValidationError.RouteRequiredFieldsMissing
  }
  if (
    routeAssignmentFormValues.startLocationId ===
    routeAssignmentFormValues.destinationLocationId
  ) {
    return FormValidationError.SameStartAndDestinationLocation
  }
  return null
}

export function findLocationTimeZoneId(
  locationId: string,
  locationLookupOptions: ReadonlyArray<LocationLookupOption>
): string | null {
  const matchingLocationLookupOption = locationLookupOptions.find(
    (locationLookupOption) => String(locationLookupOption.id) === locationId
  )
  return matchingLocationLookupOption === undefined
    ? null
    : matchingLocationLookupOption.timeZoneId
}

function getRequiredLocationTimeZoneId(
  locationId: string,
  locationLookupOptions: ReadonlyArray<LocationLookupOption>
): string {
  const locationTimeZoneId = findLocationTimeZoneId(
    locationId,
    locationLookupOptions
  )
  if (locationTimeZoneId === null) {
    throw new Error(`Location with id ${locationId} was not found.`)
  }
  return locationTimeZoneId
}

export function createCreateRouteRequestModel(
  addRouteFormValues: AddRouteFormValues,
  locationLookupOptions: ReadonlyArray<LocationLookupOption>
): CreateRouteRequestModel {
  return {
    startLocationId: Number(addRouteFormValues.startLocationId),
    destinationLocationId: Number(addRouteFormValues.destinationLocationId),
    departureTimeUtc: convertZonedLocalDateTimeToUtcIsoString(
      addRouteFormValues.departureLocalDateTime,
      getRequiredLocationTimeZoneId(
        addRouteFormValues.startLocationId,
        locationLookupOptions
      )
    ),
    arrivalTimeUtc: convertZonedLocalDateTimeToUtcIsoString(
      addRouteFormValues.arrivalLocalDateTime,
      getRequiredLocationTimeZoneId(
        addRouteFormValues.destinationLocationId,
        locationLookupOptions
      )
    ),
    autoId: Number(addRouteFormValues.autoId),
    driverId: Number(addRouteFormValues.driverId),
    status: addRouteFormValues.status,
  }
}

export function getAddRouteFormValidationError(
  addRouteFormValues: AddRouteFormValues,
  locationLookupOptions: ReadonlyArray<LocationLookupOption>
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
  const createRouteRequestModel = createCreateRouteRequestModel(
    addRouteFormValues,
    locationLookupOptions
  )
  if (
    new Date(createRouteRequestModel.arrivalTimeUtc) <=
    new Date(createRouteRequestModel.departureTimeUtc)
  ) {
    return FormValidationError.ArrivalNotAfterDeparture
  }
  return null
}
