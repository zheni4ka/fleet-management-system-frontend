import {
  CreateDriverRequestModel,
  Driver,
  DriverFormValues,
  FormValidationError,
} from "@/lib/types"

export function createEmptyDriverFormValues(): DriverFormValues {
  return {
    name: "",
    surname: "",
    patronymic: "",
    licenseNumber: "",
    depotId: "",
  }
}

export function createDriverFormValuesFromDriver(
  driver: Driver
): DriverFormValues {
  return {
    name: driver.name,
    surname: driver.surname,
    patronymic: driver.patronymic,
    licenseNumber: driver.licenseNumber,
    depotId: String(driver.depotId),
  }
}

export function getDriverFormValidationError(
  driverFormValues: DriverFormValues
): FormValidationError | null {
  const hasEmptyRequiredField = [
    driverFormValues.name,
    driverFormValues.surname,
    driverFormValues.patronymic,
    driverFormValues.licenseNumber,
    driverFormValues.depotId,
  ].some((requiredFieldValue) => requiredFieldValue.trim() === "")
  if (hasEmptyRequiredField) {
    return FormValidationError.DriverRequiredFieldsMissing
  }
  return null
}

export function createDriverRequestBody(
  driverFormValues: DriverFormValues
): CreateDriverRequestModel {
  return {
    name: driverFormValues.name.trim(),
    surname: driverFormValues.surname.trim(),
    patronymic: driverFormValues.patronymic.trim(),
    licenseNumber: driverFormValues.licenseNumber.trim(),
    depotId: Number(driverFormValues.depotId),
  }
}
