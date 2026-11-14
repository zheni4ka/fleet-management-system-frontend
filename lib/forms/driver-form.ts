import { Driver, DriverFormValues } from "@/lib/types"

export function createEmptyDriverFormValues(): DriverFormValues {
  return { name: "", surname: "", patronymic: "", licenseNumber: "" }
}

export function createDriverFormValuesFromDriver(
  driver: Driver
): DriverFormValues {
  return {
    name: driver.name,
    surname: driver.surname,
    patronymic: driver.patronymic,
    licenseNumber: driver.licenseNumber,
  }
}

export function getDriverFormValidationError(
  driverFormValues: DriverFormValues
): string | null {
  const hasEmptyRequiredField = [
    driverFormValues.name,
    driverFormValues.surname,
    driverFormValues.licenseNumber,
  ].some((requiredFieldValue) => requiredFieldValue.trim() === "")
  if (hasEmptyRequiredField) {
    return "Будь ласка, заповніть ім'я, прізвище та номер посвідчення."
  }
  return null
}

export function createDriverRequestBody(
  driverFormValues: DriverFormValues
): DriverFormValues {
  return {
    name: driverFormValues.name.trim(),
    surname: driverFormValues.surname.trim(),
    patronymic: driverFormValues.patronymic.trim(),
    licenseNumber: driverFormValues.licenseNumber.trim(),
  }
}
