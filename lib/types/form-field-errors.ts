import { FormValidationError } from "./form-validation-error"

export type FormFieldErrors<TFieldName extends string> = Readonly<
  Partial<Record<TFieldName, FormValidationError>>
>
