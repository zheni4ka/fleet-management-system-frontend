interface LoadErrorMessageProps {
  errorMessage: string
}

export function LoadErrorMessage({ errorMessage }: LoadErrorMessageProps) {
  return (
    <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-red-200">
      ❌ {errorMessage}
    </div>
  )
}
