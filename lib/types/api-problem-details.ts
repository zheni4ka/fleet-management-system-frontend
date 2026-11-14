export interface ApiProblemDetails {
  title?: string
  detail?: string
  message?: string
  errors?: Record<string, string[]>
}
