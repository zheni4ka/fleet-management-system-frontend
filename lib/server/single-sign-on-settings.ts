import { singleSignOnSettingsEnvironmentVariableNames } from "@/lib/constants"
import { SingleSignOnSettings } from "@/lib/types"

function readEnvironmentValue(environmentVariableName: string): string | null {
  const environmentValue = process.env[environmentVariableName]
  if (environmentValue === undefined || environmentValue === "") {
    return null
  }
  return environmentValue
}

export function getSingleSignOnSettings(): SingleSignOnSettings | null {
  const authority = readEnvironmentValue(
    singleSignOnSettingsEnvironmentVariableNames.authority
  )
  const clientId = readEnvironmentValue(
    singleSignOnSettingsEnvironmentVariableNames.clientId
  )
  const clientSecret = readEnvironmentValue(
    singleSignOnSettingsEnvironmentVariableNames.clientSecret
  )
  const appBaseUrl = readEnvironmentValue(
    singleSignOnSettingsEnvironmentVariableNames.appBaseUrl
  )
  if (
    authority !== null &&
    clientId !== null &&
    clientSecret !== null &&
    appBaseUrl !== null
  ) {
    return { authority, clientId, clientSecret, appBaseUrl }
  }

  const isSingleSignOnPartiallyConfigured =
    authority !== null || clientId !== null || clientSecret !== null
  if (!isSingleSignOnPartiallyConfigured) {
    return null
  }

  const missingEnvironmentVariableNames = Object.values(
    singleSignOnSettingsEnvironmentVariableNames
  ).filter(
    (environmentVariableName) =>
      readEnvironmentValue(environmentVariableName) === null
  )
  throw new Error(
    `Вхід через корпоративний обліковий запис налаштовано частково. Не задано: ${missingEnvironmentVariableNames.join(", ")}.`
  )
}
