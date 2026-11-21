import { accountEmailConstraints } from "@/lib/constants"
import { getRequiredFieldErrors } from "@/lib/forms/form-field-errors"
import {
  DispatcherFormValues,
  FormFieldErrors,
  FormValidationError,
  RegisterDispatcherRequestModel,
  UserRole,
} from "@/lib/types"

export function createEmptyDispatcherFormValues(): DispatcherFormValues {
  return { username: "", email: "", password: "", depotIds: [] }
}

export function getDispatcherFormFieldErrors(
  dispatcherFormValues: DispatcherFormValues
): FormFieldErrors<keyof DispatcherFormValues> {
  const requiredFieldErrors = getRequiredFieldErrors(dispatcherFormValues, [
    "username",
    "email",
  ])
  const trimmedEmail = dispatcherFormValues.email.trim()
  const isEmailInvalid =
    trimmedEmail !== "" && !accountEmailConstraints.pattern.test(trimmedEmail)
  return {
    ...requiredFieldErrors,
    ...(isEmailInvalid
      ? { email: FormValidationError.EmailAddressInvalid }
      : {}),
    ...(dispatcherFormValues.depotIds.length === 0
      ? { depotIds: FormValidationError.DispatcherDepotsMissing }
      : {}),
  }
}

export function createRegisterDispatcherRequestModel(
  dispatcherFormValues: DispatcherFormValues
): RegisterDispatcherRequestModel {
  return {
    username: dispatcherFormValues.username.trim(),
    email: dispatcherFormValues.email.trim(),
    password: dispatcherFormValues.password,
    role: UserRole.Dispatcher,
    depotIds: dispatcherFormValues.depotIds,
  }
}
