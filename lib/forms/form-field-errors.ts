import {
  ApiFieldErrorMessages,
  FormFieldErrorMessages,
  FormFieldErrors,
  FormValidationError,
} from "@/lib/types"

export function getRequiredFieldErrors<TFieldName extends string>(
  formValues: Readonly<Record<TFieldName, string>>,
  requiredFieldNames: ReadonlyArray<TFieldName>
): FormFieldErrors<TFieldName> {
  return Object.fromEntries(
    requiredFieldNames
      .filter(
        (requiredFieldName) => formValues[requiredFieldName].trim() === ""
      )
      .map((requiredFieldName) => [
        requiredFieldName,
        FormValidationError.RequiredFieldMissing,
      ])
  ) as FormFieldErrors<TFieldName>
}

export function hasFormFieldErrors(
  formFieldErrors: Readonly<Partial<Record<string, unknown>>>
): boolean {
  return Object.values(formFieldErrors).some(
    (formFieldError) => formFieldError !== undefined
  )
}

export function normalizeApiPropertyName(apiPropertyName: string): string {
  const topLevelPropertyName = apiPropertyName.split(/[.[]/)[0]
  return (
    topLevelPropertyName.charAt(0).toLowerCase() + topLevelPropertyName.slice(1)
  )
}

export function mapApiFieldErrorMessages<TFieldName extends string>(
  apiFieldErrorMessages: ApiFieldErrorMessages,
  formFieldNamesByApiPropertyName: Readonly<Record<string, TFieldName>>
): FormFieldErrorMessages<TFieldName> {
  const formFieldNames = new Set(
    Object.values<TFieldName>(formFieldNamesByApiPropertyName)
  )
  const formFieldErrorMessages: FormFieldErrorMessages<TFieldName> =
    Object.fromEntries(
      [...formFieldNames]
        .map((formFieldName) => [
          formFieldName,
          Object.entries(apiFieldErrorMessages)
            .filter(
              ([apiPropertyName]) =>
                formFieldNamesByApiPropertyName[
                  normalizeApiPropertyName(apiPropertyName)
                ] === formFieldName
            )
            .flatMap(([, apiErrorMessages]) => apiErrorMessages)
            .join(" "),
        ])
        .filter(([, formFieldErrorMessage]) => formFieldErrorMessage !== "")
    )
  return formFieldErrorMessages
}
