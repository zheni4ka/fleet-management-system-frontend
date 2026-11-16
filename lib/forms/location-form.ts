import { LocationFormValues } from "@/lib/types"

export function createEmptyLocationFormValues(): LocationFormValues {
  return { city: "", country: "", timeZoneId: "" }
}

export function getLocationFormValidationError(
  locationFormValues: LocationFormValues
): string | null {
  const hasEmptyRequiredField = [
    locationFormValues.city,
    locationFormValues.country,
    locationFormValues.timeZoneId,
  ].some((requiredFieldValue) => requiredFieldValue.trim() === "")
  if (hasEmptyRequiredField) {
    return "Будь ласка, вкажіть місто, країну та часовий пояс."
  }
  return null
}

export function createLocationRequestBody(
  locationFormValues: LocationFormValues
): LocationFormValues {
  return {
    city: locationFormValues.city.trim(),
    country: locationFormValues.country.trim(),
    timeZoneId: locationFormValues.timeZoneId,
  }
}
