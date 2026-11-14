import { LocationFormValues } from "@/lib/types"

export function createEmptyLocationFormValues(): LocationFormValues {
  return { city: "", country: "" }
}

export function getLocationFormValidationError(
  locationFormValues: LocationFormValues
): string | null {
  const hasEmptyRequiredField = [
    locationFormValues.city,
    locationFormValues.country,
  ].some((requiredFieldValue) => requiredFieldValue.trim() === "")
  if (hasEmptyRequiredField) {
    return "Будь ласка, вкажіть місто та країну."
  }
  return null
}

export function createLocationRequestBody(
  locationFormValues: LocationFormValues
): LocationFormValues {
  return {
    city: locationFormValues.city.trim(),
    country: locationFormValues.country.trim(),
  }
}
