"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import toast from "react-hot-toast"
import {
  hasFormFieldErrors,
  mapApiFieldErrorMessages,
} from "@/lib/forms/form-field-errors"
import {
  ApiFieldErrorMessages,
  FormFieldErrorMessages,
  FormFieldErrors,
  FormValidationError,
} from "@/lib/types"

export function useFormFieldErrorMessages(
  formFieldNamesByApiPropertyName: Readonly<Record<string, string>>
) {
  const formValidationTranslations = useTranslations("formValidation")
  const [formFieldErrorMessages, setFormFieldErrorMessages] = useState<
    FormFieldErrorMessages<string>
  >({})

  const showFormFieldErrors = (
    formFieldErrors: FormFieldErrors<string>,
    extraFormFieldErrorMessages: FormFieldErrorMessages<string> = {}
  ): boolean => {
    const nextFormFieldErrorMessages: FormFieldErrorMessages<string> = {
      ...Object.fromEntries(
        Object.entries(formFieldErrors).flatMap(
          ([formFieldName, formValidationError]) =>
            formValidationError === undefined
              ? []
              : [
                  [
                    formFieldName,
                    formValidationTranslations(formValidationError),
                  ],
                ]
        )
      ),
      ...extraFormFieldErrorMessages,
    }
    setFormFieldErrorMessages(nextFormFieldErrorMessages)
    const hasErrors = hasFormFieldErrors(nextFormFieldErrorMessages)
    if (hasErrors) {
      toast.error(
        formValidationTranslations(FormValidationError.FormFieldsNeedAttention)
      )
    }
    return hasErrors
  }

  const showApiFieldErrorMessages = (
    apiFieldErrorMessages: ApiFieldErrorMessages
  ) => {
    setFormFieldErrorMessages(
      mapApiFieldErrorMessages(
        apiFieldErrorMessages,
        formFieldNamesByApiPropertyName
      )
    )
  }

  const clearChangedFormFieldErrorMessages = <TFormValues extends object>(
    previousFormValues: TFormValues,
    nextFormValues: TFormValues
  ) => {
    setFormFieldErrorMessages((currentFormFieldErrorMessages) =>
      Object.fromEntries(
        Object.entries(currentFormFieldErrorMessages).filter(
          ([formFieldName]) =>
            Object.is(
              Reflect.get(previousFormValues, formFieldName),
              Reflect.get(nextFormValues, formFieldName)
            )
        )
      )
    )
  }

  const clearFormFieldErrorMessages = () => setFormFieldErrorMessages({})

  return {
    formFieldErrorMessages,
    showFormFieldErrors,
    showApiFieldErrorMessages,
    clearChangedFormFieldErrorMessages,
    clearFormFieldErrorMessages,
  }
}
