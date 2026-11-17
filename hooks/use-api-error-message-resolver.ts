"use client"

import { useTranslations } from "next-intl"
import { ApiRequestFailedError } from "@/lib/api-request-failed-error"
import { ConcurrencyConflictError } from "@/lib/concurrency-conflict-error"
import { UnexpectedApiResponseFormatError } from "@/lib/unexpected-api-response-format-error"

export function useApiErrorMessageResolver() {
  const commonTranslations = useTranslations("common")

  return (error: unknown, fallbackErrorMessage: string): string => {
    if (error instanceof ConcurrencyConflictError) {
      return commonTranslations("concurrencyConflictMessage")
    }
    if (error instanceof UnexpectedApiResponseFormatError) {
      return commonTranslations("unexpectedApiResponseFormatMessage")
    }
    if (error instanceof ApiRequestFailedError) {
      return (
        error.problemMessage ??
        commonTranslations("serverErrorMessage", {
          status: error.responseStatus,
        })
      )
    }
    return fallbackErrorMessage
  }
}
