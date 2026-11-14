import { EditRouteFormValues, Route } from "@/lib/types"

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

export function getEditRouteFormValidationError(
  editRouteFormValues: EditRouteFormValues
): string | null {
  const hasEmptyRequiredField = [
    editRouteFormValues.startLocationId,
    editRouteFormValues.destinationLocationId,
    editRouteFormValues.autoId,
    editRouteFormValues.driverId,
  ].some((requiredFieldValue) => requiredFieldValue === "")
  if (hasEmptyRequiredField) {
    return "Будь ласка, заповніть всі поля форми перед збереженням."
  }
  if (
    editRouteFormValues.startLocationId ===
    editRouteFormValues.destinationLocationId
  ) {
    return "Початкова та кінцева локації мають відрізнятися."
  }
  return null
}

export function createEditRouteRequestBody(
  routeId: number,
  editRouteFormValues: EditRouteFormValues
) {
  return {
    id: routeId,
    startLocationId: Number(editRouteFormValues.startLocationId),
    destinationLocationId: Number(editRouteFormValues.destinationLocationId),
    autoId: Number(editRouteFormValues.autoId),
    driverId: Number(editRouteFormValues.driverId),
    status: editRouteFormValues.status,
  }
}
