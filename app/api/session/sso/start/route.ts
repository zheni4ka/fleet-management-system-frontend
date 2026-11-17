import { NextResponse, type NextRequest } from "next/server"
import {
  bffRoutes,
  cookieNames,
  httpStatusCodes,
  loginSearchParamNames,
  openIdConnectProtocolValues,
} from "@/lib/constants"
import { getSafeReturnPath } from "@/lib/login-redirect"
import { createProblemResponse } from "@/lib/server/bff-response"
import {
  createPkceCodeChallenge,
  createRandomBase64UrlValue,
  createSingleSignOnCallbackUrl,
  fetchOidcDiscoveryDocument,
} from "@/lib/server/open-id-connect"
import { getSingleSignOnSettings } from "@/lib/server/single-sign-on-settings"
import { SingleSignOnTransaction } from "@/lib/types"
import { createRequestMessageTranslator } from "@/lib/server/request-message-translator"

export async function GET(request: NextRequest) {
  const singleSignOnSettings = getSingleSignOnSettings()
  if (singleSignOnSettings === null) {
    return createProblemResponse(
      httpStatusCodes.notFound,
      createRequestMessageTranslator(request)(
        "bffErrors.singleSignOnNotConfigured"
      )
    )
  }

  const singleSignOnTransaction: SingleSignOnTransaction = {
    state: createRandomBase64UrlValue(),
    nonce: createRandomBase64UrlValue(),
    codeVerifier: createRandomBase64UrlValue(),
    returnPath: getSafeReturnPath(
      request.nextUrl.searchParams.get(loginSearchParamNames.returnUrl) ?? ""
    ),
  }
  const oidcDiscoveryDocument = await fetchOidcDiscoveryDocument(
    singleSignOnSettings.authority
  )

  const authorizationUrl = new URL(oidcDiscoveryDocument.authorization_endpoint)
  const authorizationSearchParams = {
    client_id: singleSignOnSettings.clientId,
    response_type: openIdConnectProtocolValues.responseTypeCode,
    response_mode: openIdConnectProtocolValues.responseModeQuery,
    redirect_uri: createSingleSignOnCallbackUrl(
      singleSignOnSettings.appBaseUrl
    ),
    scope: openIdConnectProtocolValues.scope,
    state: singleSignOnTransaction.state,
    nonce: singleSignOnTransaction.nonce,
    code_challenge: await createPkceCodeChallenge(
      singleSignOnTransaction.codeVerifier
    ),
    code_challenge_method: openIdConnectProtocolValues.codeChallengeMethod,
  }
  for (const [searchParamName, searchParamValue] of Object.entries(
    authorizationSearchParams
  )) {
    authorizationUrl.searchParams.set(searchParamName, searchParamValue)
  }

  const authorizationRedirectResponse = NextResponse.redirect(authorizationUrl)
  authorizationRedirectResponse.cookies.set(
    cookieNames.singleSignOnTransaction,
    JSON.stringify(singleSignOnTransaction),
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: bffRoutes.singleSignOnCallback,
      maxAge: openIdConnectProtocolValues.transactionCookieMaxAgeSeconds,
    }
  )
  return authorizationRedirectResponse
}
