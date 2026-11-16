import { jwtClaimNames, timeUnitConversions } from "@/lib/constants"
import { UserRole } from "@/lib/types"
import { findEnumValue } from "@/lib/utils"

function decodeBase64UrlToText(base64UrlText: string): string {
  const base64Text = base64UrlText.replace(/-/g, "+").replace(/_/g, "/")
  const paddedBase64Text = base64Text.padEnd(
    Math.ceil(base64Text.length / 4) * 4,
    "="
  )
  const decodedBytes = Uint8Array.from(atob(paddedBase64Text), (character) =>
    character.charCodeAt(0)
  )
  return new TextDecoder().decode(decodedBytes)
}

function decodeAuthTokenPayload(
  authToken: string
): Record<string, unknown> | null {
  const encodedAuthTokenPayload = authToken.split(".")[1]
  if (encodedAuthTokenPayload === undefined) {
    console.error("Токен авторизації має некоректний формат.")
    return null
  }

  try {
    const authTokenPayload: unknown = JSON.parse(
      decodeBase64UrlToText(encodedAuthTokenPayload)
    )
    if (typeof authTokenPayload !== "object" || authTokenPayload === null) {
      console.error("Вміст токена авторизації не є об'єктом.")
      return null
    }
    return authTokenPayload as Record<string, unknown>
  } catch (error) {
    console.error("Не вдалося розшифрувати токен авторизації:", error)
    return null
  }
}

export function getUserRolesFromAuthToken(
  authToken: string
): ReadonlyArray<string> {
  const authTokenPayload = decodeAuthTokenPayload(authToken)
  if (authTokenPayload === null) {
    return []
  }
  const roleClaim =
    authTokenPayload[jwtClaimNames.role] ??
    authTokenPayload[jwtClaimNames.shortRole]

  if (typeof roleClaim === "string") {
    return [roleClaim]
  }
  if (Array.isArray(roleClaim)) {
    return roleClaim.filter(
      (roleClaimValue): roleClaimValue is string =>
        typeof roleClaimValue === "string"
    )
  }
  return []
}

export function getKnownUserRolesFromAuthToken(
  authToken: string
): ReadonlyArray<UserRole> {
  return getUserRolesFromAuthToken(authToken).flatMap((userRoleName) => {
    const knownUserRole = findEnumValue(UserRole, userRoleName)
    return knownUserRole === null ? [] : [knownUserRole]
  })
}

export function hasAuthTokenUserRole(
  authToken: string,
  userRole: UserRole
): boolean {
  return getUserRolesFromAuthToken(authToken).includes(userRole)
}

export function getUserNameFromAuthToken(authToken: string): string | null {
  const userNameClaim =
    decodeAuthTokenPayload(authToken)?.[jwtClaimNames.userName]
  return typeof userNameClaim === "string" && userNameClaim !== ""
    ? userNameClaim
    : null
}

export function isAuthTokenUnexpiredForAtLeast(
  authToken: string,
  minimumRemainingLifetimeMilliseconds: number
): boolean {
  const expirationTimeClaim =
    decodeAuthTokenPayload(authToken)?.[jwtClaimNames.expirationTime]
  if (typeof expirationTimeClaim !== "number") {
    return false
  }
  return (
    expirationTimeClaim * timeUnitConversions.millisecondsPerSecond >
    Date.now() + minimumRemainingLifetimeMilliseconds
  )
}

export function isAuthTokenUnexpired(authToken: string): boolean {
  return isAuthTokenUnexpiredForAtLeast(authToken, 0)
}
