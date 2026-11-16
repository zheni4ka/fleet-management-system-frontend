import { NextResponse, type NextRequest } from "next/server"
import {
  apiEndpoints,
  bffErrorMessages,
  bffRoutes,
  cookieNames,
  httpContentTypes,
  httpHeaderNames,
  httpStatusCodes,
  openIdConnectAuthorizationResponseParamNames,
  openIdConnectProtocolValues,
} from "@/lib/constants"
import { parseApiResponseBody } from "@/lib/api-response-body"
import { createLoginPath } from "@/lib/login-redirect"
import { postToBackend } from "@/lib/server/backend-api"
import { createProblemResponse } from "@/lib/server/bff-response"
import {
  createSingleSignOnCallbackUrl,
  fetchOidcDiscoveryDocument,
} from "@/lib/server/open-id-connect"
import { setSessionResponseCookies } from "@/lib/server/session-cookies"
import { getSingleSignOnSettings } from "@/lib/server/single-sign-on-settings"
import { oidcTokenResponseSchema } from "@/lib/schemas/oidc-token-response-schema"
import { sessionResponseSchema } from "@/lib/schemas/session-response-schema"
import { singleSignOnTransactionSchema } from "@/lib/schemas/single-sign-on-transaction-schema"
import {
  HttpMethod,
  LoginRedirectReason,
  SingleSignOnSettings,
  SingleSignOnTransaction,
} from "@/lib/types"

function readSingleSignOnTransaction(
  request: NextRequest
): SingleSignOnTransaction | null {
  const singleSignOnTransactionCookieValue = request.cookies.get(
    cookieNames.singleSignOnTransaction
  )?.value
  if (singleSignOnTransactionCookieValue === undefined) {
    return null
  }
  try {
    const singleSignOnTransactionParseResult =
      singleSignOnTransactionSchema.safeParse(
        JSON.parse(singleSignOnTransactionCookieValue)
      )
    return singleSignOnTransactionParseResult.success
      ? singleSignOnTransactionParseResult.data
      : null
  } catch {
    return null
  }
}

function createLoginRedirectResponse(
  singleSignOnSettings: SingleSignOnSettings,
  loginRedirectReason: LoginRedirectReason
): NextResponse {
  const loginRedirectResponse = NextResponse.redirect(
    new URL(
      createLoginPath(null, loginRedirectReason),
      singleSignOnSettings.appBaseUrl
    )
  )
  loginRedirectResponse.cookies.delete({
    name: cookieNames.singleSignOnTransaction,
    path: bffRoutes.singleSignOnCallback,
  })
  return loginRedirectResponse
}

async function exchangeAuthorizationCodeForIdToken(
  singleSignOnSettings: SingleSignOnSettings,
  authorizationCode: string,
  codeVerifier: string
): Promise<string> {
  const oidcDiscoveryDocument = await fetchOidcDiscoveryDocument(
    singleSignOnSettings.authority
  )
  const tokenResponse = await fetch(oidcDiscoveryDocument.token_endpoint, {
    method: HttpMethod.Post,
    headers: {
      [httpHeaderNames.contentType]: httpContentTypes.formUrlEncoded,
    },
    body: new URLSearchParams({
      grant_type: openIdConnectProtocolValues.grantTypeAuthorizationCode,
      code: authorizationCode,
      redirect_uri: createSingleSignOnCallbackUrl(
        singleSignOnSettings.appBaseUrl
      ),
      client_id: singleSignOnSettings.clientId,
      client_secret: singleSignOnSettings.clientSecret,
      code_verifier: codeVerifier,
    }),
    cache: "no-store",
  })
  if (!tokenResponse.ok) {
    throw new Error(
      `Постачальник ідентичності відхилив обмін коду авторизації: статус ${tokenResponse.status}.`
    )
  }
  return parseApiResponseBody(
    oidcDiscoveryDocument.token_endpoint,
    await tokenResponse.json(),
    oidcTokenResponseSchema
  ).id_token
}

export async function GET(request: NextRequest) {
  const singleSignOnSettings = getSingleSignOnSettings()
  if (singleSignOnSettings === null) {
    return createProblemResponse(
      httpStatusCodes.notFound,
      bffErrorMessages.singleSignOnNotConfigured
    )
  }

  const singleSignOnTransaction = readSingleSignOnTransaction(request)
  const authorizationResponseParams = request.nextUrl.searchParams
  const authorizationCode = authorizationResponseParams.get(
    openIdConnectAuthorizationResponseParamNames.code
  )
  const isAuthorizationResponseForThisTransaction =
    singleSignOnTransaction !== null &&
    authorizationResponseParams.get(openIdConnectAuthorizationResponseParamNames.state) ===
      singleSignOnTransaction.state
  if (
    !isAuthorizationResponseForThisTransaction ||
    authorizationCode === null ||
    authorizationResponseParams.has(openIdConnectAuthorizationResponseParamNames.error)
  ) {
    console.error(
      "Відповідь постачальника ідентичності не відповідає транзакції входу або містить помилку:",
      authorizationResponseParams.get(openIdConnectAuthorizationResponseParamNames.error)
    )
    return createLoginRedirectResponse(
      singleSignOnSettings,
      LoginRedirectReason.SingleSignOnFailed
    )
  }

  let backendLoginResponse: Response
  try {
    const idToken = await exchangeAuthorizationCodeForIdToken(
      singleSignOnSettings,
      authorizationCode,
      singleSignOnTransaction.codeVerifier
    )
    backendLoginResponse = await postToBackend(
      apiEndpoints.loginWithExternalIdentity,
      request.headers,
      { idToken, nonce: singleSignOnTransaction.nonce }
    )
  } catch (error) {
    console.error("Не вдалося завершити вхід через корпоративний обліковий запис:", error)
    return createLoginRedirectResponse(
      singleSignOnSettings,
      LoginRedirectReason.SingleSignOnFailed
    )
  }

  if (backendLoginResponse.status === httpStatusCodes.forbidden) {
    return createLoginRedirectResponse(
      singleSignOnSettings,
      LoginRedirectReason.SingleSignOnAccessDenied
    )
  }
  if (!backendLoginResponse.ok) {
    console.error(
      `Сервер відхилив вхід через корпоративний обліковий запис: статус ${backendLoginResponse.status}.`
    )
    return createLoginRedirectResponse(
      singleSignOnSettings,
      LoginRedirectReason.SingleSignOnFailed
    )
  }

  const session = parseApiResponseBody(
    apiEndpoints.loginWithExternalIdentity,
    await backendLoginResponse.json(),
    sessionResponseSchema
  )
  const signedInResponse = NextResponse.redirect(
    new URL(singleSignOnTransaction.returnPath, singleSignOnSettings.appBaseUrl)
  )
  setSessionResponseCookies(signedInResponse.cookies, session)
  signedInResponse.cookies.delete({
    name: cookieNames.singleSignOnTransaction,
    path: bffRoutes.singleSignOnCallback,
  })
  return signedInResponse
}
