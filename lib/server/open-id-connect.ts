import { z } from "zod"
import { bffRoutes, openIdConnectProtocolValues } from "@/lib/constants"
import { parseApiResponseBody } from "@/lib/api-response-body"
import { oidcDiscoveryDocumentSchema } from "@/lib/schemas/oidc-discovery-document-schema"

export function createRandomBase64UrlValue(): string {
  const randomBytes = crypto.getRandomValues(
    new Uint8Array(openIdConnectProtocolValues.randomValueByteLength)
  )
  return Buffer.from(randomBytes).toString("base64url")
}

export async function createPkceCodeChallenge(
  codeVerifier: string
): Promise<string> {
  const codeVerifierHash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier)
  )
  return Buffer.from(codeVerifierHash).toString("base64url")
}

export async function fetchOidcDiscoveryDocument(
  authority: string
): Promise<z.infer<typeof oidcDiscoveryDocumentSchema>> {
  const discoveryDocumentUrl = `${authority.replace(/\/+$/, "")}${openIdConnectProtocolValues.metadataPath}`
  const discoveryDocumentResponse = await fetch(discoveryDocumentUrl, {
    next: { revalidate: openIdConnectProtocolValues.discoveryCacheSeconds },
  })
  if (!discoveryDocumentResponse.ok) {
    throw new Error(
      `Не вдалося отримати метадані OpenID Connect з ${discoveryDocumentUrl}: статус ${discoveryDocumentResponse.status}.`
    )
  }
  return parseApiResponseBody(
    discoveryDocumentUrl,
    await discoveryDocumentResponse.json(),
    oidcDiscoveryDocumentSchema
  )
}

export function createSingleSignOnCallbackUrl(appBaseUrl: string): string {
  return new URL(bffRoutes.singleSignOnCallback, appBaseUrl).toString()
}
