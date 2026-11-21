import {
  accountEmailConstraints,
  driverContactConstraints,
} from "@/lib/constants"
import { getRequiredFieldErrors } from "@/lib/forms/form-field-errors"
import {
  CreateDriverRequestModel,
  Driver,
  DriverFormValues,
  FormFieldErrors,
  FormValidationError,
} from "@/lib/types"

export function createEmptyDriverFormValues(): DriverFormValues {
  return {
    name: "",
    surname: "",
    patronymic: "",
    licenseNumber: "",
    phoneNumber: "",
    email: "",
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
    phoneNumber: driver.phoneNumber ?? "",
    email: driver.email ?? "",
    depotId: String(driver.depotId),
  }
}

export function getDriverFormFieldErrors(
  driverFormValues: DriverFormValues
): FormFieldErrors<keyof DriverFormValues> {
  const trimmedPhoneNumber = driverFormValues.phoneNumber.trim()
  const trimmedEmail = driverFormValues.email.trim()
  const isPhoneNumberInvalid =
    trimmedPhoneNumber !== "" &&
    !driverContactConstraints.phoneNumberPattern.test(trimmedPhoneNumber)
  const isEmailInvalid =
    trimmedEmail !== "" && !accountEmailConstraints.pattern.test(trimmedEmail)
  return {
    ...getRequiredFieldErrors(driverFormValues, [
      "name",
      "surname",
      "patronymic",
      "licenseNumber",
      "depotId",
    ]),
    ...(isPhoneNumberInvalid
      ? { phoneNumber: FormValidationError.PhoneNumberFormatInvalid }
      : {}),
    ...(isEmailInvalid
      ? { email: FormValidationError.EmailAddressInvalid }
      : {}),
  }
}

function getOptionalTrimmedText(optionalText: string): string | null {
  const trimmedText = optionalText.trim()
  return trimmedText === "" ? null : trimmedText
}

export function createDriverRequestBody(
  driverFormValues: DriverFormValues
): CreateDriverRequestModel {
  return {
    name: driverFormValues.name.trim(),
    surname: driverFormValues.surname.trim(),
    patronymic: driverFormValues.patronymic.trim(),
    licenseNumber: driverFormValues.licenseNumber.trim(),
    phoneNumber: getOptionalTrimmedText(driverFormValues.phoneNumber),
    email: getOptionalTrimmedText(driverFormValues.email),
    depotId: Number(driverFormValues.depotId),
  }
}
