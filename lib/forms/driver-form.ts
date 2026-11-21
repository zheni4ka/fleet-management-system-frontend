import { getRequiredFieldErrors } from "@/lib/forms/form-field-errors"
import {
  CreateDriverRequestModel,
  Driver,
  DriverFormValues,
  FormFieldErrors,
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

export function getDriverFormFieldErrors(
  driverFormValues: DriverFormValues
): FormFieldErrors<keyof DriverFormValues> {
  return getRequiredFieldErrors(driverFormValues, [
    "name",
    "surname",
    "patronymic",
    "licenseNumber",
    "depotId",
  ])
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
