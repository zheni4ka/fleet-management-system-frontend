export type FormFieldErrorMessages<TFieldName extends string> = Readonly<
  Partial<Record<TFieldName, string>>
>
