import { jwtClaimNames } from "@/lib/constants"
import { UserRole } from "@/lib/types"

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

export function getUserRolesFromAuthToken(
  authToken: string
): ReadonlyArray<string> {
  const encodedAuthTokenPayload = authToken.split(".")[1]
  if (encodedAuthTokenPayload === undefined) {
    console.error("Токен авторизації має некоректний формат.")
    return []
  }

  try {
    const authTokenPayload: Record<string, unknown> = JSON.parse(
      decodeBase64UrlToText(encodedAuthTokenPayload)
    )
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
  } catch (error) {
    console.error("Не вдалося розшифрувати токен авторизації:", error)
    return []
  }
}

export function hasAuthTokenUserRole(
  authToken: string,
  userRole: UserRole
): boolean {
  return getUserRolesFromAuthToken(authToken).includes(userRole)
}
