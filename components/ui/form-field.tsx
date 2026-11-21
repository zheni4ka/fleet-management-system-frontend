import * as React from "react"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  isRequired?: boolean
  hint?: string
  errorMessage?: string
  className?: string
  children: React.ReactNode
}

export function FormField({
  label,
  isRequired = false,
  hint,
  errorMessage,
  className,
  children,
}: FormFieldProps) {
  const hasErrorMessage = errorMessage !== undefined && errorMessage !== ""
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        hasErrorMessage &&
          "[&_button[role=combobox]]:border-red-500 [&_input]:border-red-500 [&_select]:border-red-500 [&_textarea]:border-red-500",
        className
      )}
    >
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        <span>
          {label}
          {isRequired && (
            <span aria-hidden="true" className="ml-0.5 text-red-600">
              *
            </span>
          )}
        </span>
        {children}
      </label>
      {hasErrorMessage ? (
        <p role="alert" className="text-xs font-medium text-red-600">
          {errorMessage}
        </p>
      ) : (
        hint !== undefined && <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  )
}
