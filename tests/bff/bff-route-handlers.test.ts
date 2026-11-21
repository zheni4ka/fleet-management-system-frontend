import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { POST as postSessionLogin } from "@/app/api/session/login/route"
import { POST as postSessionLogout } from "@/app/api/session/logout/route"
import {
  DELETE as deleteThroughApiProxy,
  GET as getThroughApiProxy,
} from "@/app/api/proxy/[...apiPath]/route"

const testApiBaseUrl = "http://api.test"
const frontendOrigin = "http://localhost:3000"
const frontendHost = "localhost:3000"
const testTraceparent =
  "00-0123456789abcdef0123456789abcdef-0123456789abcdef-01"

const backendSessionResponseBody = {
  accessToken: "access-token-value",
  accessTokenExpiresAtUtc: "2026-12-01T06:15:00+00:00",
  refreshToken: "refresh-token-value",
  refreshTokenExpiresAtUtc: "2026-12-08T06:00:00+00:00",
  username: "admin",
  email: null,
  roles: ["Admin"],
  preferredLanguage: "en",
}

function createJsonResponse(
  statusCode: number,
  responseBody: object
): Response {
  return new Response(JSON.stringify(responseBody), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  })
}

function createBffRequest(
  path: string,
  method: string,
  requestHeaders: Record<string, string>,
  requestBody?: object
): NextRequest {
  return new NextRequest(`${frontendOrigin}${path}`, {
    method,
    headers: { host: frontendHost, ...requestHeaders },
    body: requestBody === undefined ? undefined : JSON.stringify(requestBody),
  })
}

function createApiProxyRouteContext(apiPath: string[]) {
  return { params: Promise.resolve({ apiPath }) }
}

const backendFetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  vi.stubEnv("API_BASE_URL", testApiBaseUrl)
  vi.stubGlobal("fetch", backendFetchMock)
  vi.spyOn(console, "info").mockImplementation(() => undefined)
  vi.spyOn(console, "error").mockImplementation(() => undefined)
})

afterEach(() => {
  backendFetchMock.mockReset()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("POST /api/session/login", () => {
  it("rejects a cross-origin request without calling the API", async () => {
    const loginResponse = await postSessionLogin(
      createBffRequest(
        "/api/session/login",
        "POST",
        { origin: "https://attacker.example" },
        { username: "admin", password: "Valid1Password" }
      )
    )

    expect(loginResponse.status).toBe(403)
    expect(backendFetchMock).not.toHaveBeenCalled()
  })

  it("stores the tokens only in HttpOnly, Secure, SameSite=Lax cookies", async () => {
    backendFetchMock.mockResolvedValue(
      createJsonResponse(200, backendSessionResponseBody)
    )

    const loginResponse = await postSessionLogin(
      createBffRequest(
        "/api/session/login",
        "POST",
        {
          origin: frontendOrigin,
          traceparent: testTraceparent,
          "x-forwarded-for": "203.0.113.7",
          "accept-language": "en",
        },
        { username: "admin", password: "Valid1Password" }
      )
    )

    expect(loginResponse.status).toBe(204)
    expect(await loginResponse.text()).toBe("")
    const setCookieHeaders = loginResponse.headers.getSetCookie()
    expect(setCookieHeaders).toHaveLength(3)
    expect(
      setCookieHeaders.some((setCookieHeader) =>
        setCookieHeader.startsWith("NEXT_LOCALE=en;")
      )
    ).toBe(true)
    for (const setCookieHeader of setCookieHeaders) {
      expect(setCookieHeader).toMatch(/HttpOnly/i)
      expect(setCookieHeader).toMatch(/Secure/i)
      expect(setCookieHeader).toMatch(/SameSite=lax/i)
    }
    const [backendRequestUrl, backendRequestInit] =
      backendFetchMock.mock.calls[0]
    expect(backendRequestUrl).toBe(`${testApiBaseUrl}/api/v1/Account/login`)
    const backendRequestHeaders = new Headers(backendRequestInit?.headers)
    expect(backendRequestHeaders.get("traceparent")).toBe(testTraceparent)
    expect(backendRequestHeaders.get("accept-language")).toBe("en")
    expect(backendRequestHeaders.get("x-forwarded-for")).toBe("203.0.113.7")
  })

  it("passes API errors through unchanged", async () => {
    backendFetchMock.mockResolvedValue(
      createJsonResponse(401, {
        detail: "Неправильне ім'я користувача або пароль.",
      })
    )

    const loginResponse = await postSessionLogin(
      createBffRequest(
        "/api/session/login",
        "POST",
        { origin: frontendOrigin },
        { username: "admin", password: "Wrong1Password" }
      )
    )

    expect(loginResponse.status).toBe(401)
    expect(await loginResponse.json()).toEqual({
      detail: "Неправильне ім'я користувача або пароль.",
    })
    expect(loginResponse.headers.getSetCookie()).toHaveLength(0)
  })

  it("rejects a malformed body", async () => {
    const loginResponse = await postSessionLogin(
      createBffRequest(
        "/api/session/login",
        "POST",
        { origin: frontendOrigin },
        { username: "" }
      )
    )

    expect(loginResponse.status).toBe(400)
    expect(backendFetchMock).not.toHaveBeenCalled()
  })
})

describe("POST /api/session/logout", () => {
  it("revokes the refresh token in the API and clears both cookies", async () => {
    backendFetchMock.mockResolvedValue(new Response(null, { status: 204 }))

    const logoutResponse = await postSessionLogout(
      createBffRequest("/api/session/logout", "POST", {
        origin: frontendOrigin,
        cookie:
          "accessToken=access-token-value; refreshToken=refresh-token-value",
      })
    )

    expect(logoutResponse.status).toBe(204)
    const [backendRequestUrl, backendRequestInit] =
      backendFetchMock.mock.calls[0]
    expect(backendRequestUrl).toBe(`${testApiBaseUrl}/api/v1/Account/logout`)
    expect(JSON.parse(String(backendRequestInit?.body))).toEqual({
      refreshToken: "refresh-token-value",
    })
    const clearedCookieNames = logoutResponse.headers
      .getSetCookie()
      .map((setCookieHeader) => setCookieHeader.split("=")[0])
    expect(clearedCookieNames).toEqual(["accessToken", "refreshToken"])
  })
})

describe("/api/proxy/[...apiPath]", () => {
  it("refuses paths outside the API", async () => {
    const proxyResponse = await getThroughApiProxy(
      createBffRequest("/api/proxy/api/../health", "GET", {
        cookie: "accessToken=access-token-value",
      }),
      createApiProxyRouteContext(["api", "..", "health"])
    )

    expect(proxyResponse.status).toBe(404)
    expect(backendFetchMock).not.toHaveBeenCalled()
  })

  it("returns 401 when there is no access token cookie", async () => {
    const proxyResponse = await getThroughApiProxy(
      createBffRequest("/api/proxy/api/v1/Depot/getDepots", "GET", {}),
      createApiProxyRouteContext(["api", "v1", "Depot", "getDepots"])
    )

    expect(proxyResponse.status).toBe(401)
    expect(backendFetchMock).not.toHaveBeenCalled()
  })

  it("attaches the bearer token and trace context server-side and returns the API body", async () => {
    backendFetchMock.mockResolvedValue(
      createJsonResponse(200, [{ id: 1, name: "Основне депо" }])
    )

    const proxyResponse = await getThroughApiProxy(
      createBffRequest("/api/proxy/api/v1/Depot/getDepots?page=1", "GET", {
        cookie: "accessToken=access-token-value",
        traceparent: testTraceparent,
        "accept-language": "en",
      }),
      createApiProxyRouteContext(["api", "v1", "Depot", "getDepots"])
    )

    expect(proxyResponse.status).toBe(200)
    expect(await proxyResponse.json()).toEqual([
      { id: 1, name: "Основне депо" },
    ])
    const [backendRequestUrl, backendRequestInit] =
      backendFetchMock.mock.calls[0]
    expect(backendRequestUrl).toBe(
      `${testApiBaseUrl}/api/v1/Depot/getDepots?page=1`
    )
    const backendRequestHeaders = new Headers(backendRequestInit?.headers)
    expect(backendRequestHeaders.get("authorization")).toBe(
      "Bearer access-token-value"
    )
    expect(backendRequestHeaders.get("traceparent")).toBe(testTraceparent)
    expect(backendRequestHeaders.get("accept-language")).toBe("en")
  })

  it("passes an API server error through with its message", async () => {
    backendFetchMock.mockResolvedValue(
      createJsonResponse(500, {
        status: 500,
        title: "Internal Server Error",
        detail: "Сталася неочікувана помилка.",
      })
    )

    const proxyResponse = await getThroughApiProxy(
      createBffRequest("/api/proxy/api/v1/Route/getRoutesPagedList", "GET", {
        cookie: "accessToken=access-token-value",
      }),
      createApiProxyRouteContext(["api", "v1", "Route", "getRoutesPagedList"])
    )

    expect(proxyResponse.status).toBe(500)
    expect((await proxyResponse.json()).detail).toBe(
      "Сталася неочікувана помилка."
    )
  })

  it("answers 503 with a message when the API does not respond in time", async () => {
    backendFetchMock.mockRejectedValue(
      new DOMException("The operation timed out.", "TimeoutError")
    )

    const proxyResponse = await getThroughApiProxy(
      createBffRequest("/api/proxy/api/v1/Route/getRoutesPagedList", "GET", {
        cookie: "accessToken=access-token-value",
      }),
      createApiProxyRouteContext(["api", "v1", "Route", "getRoutesPagedList"])
    )

    const [, backendRequestInit] = backendFetchMock.mock.calls[0]
    expect(backendRequestInit?.signal).toBeInstanceOf(AbortSignal)
    expect(proxyResponse.status).toBe(503)
    expect((await proxyResponse.json()).detail).not.toBe("")
  })

  it("rejects a mutation that does not come from the same origin", async () => {
    const proxyResponse = await deleteThroughApiProxy(
      createBffRequest("/api/proxy/api/v1/Route/deleteRoute/1", "DELETE", {
        cookie: "accessToken=access-token-value",
      }),
      createApiProxyRouteContext(["api", "v1", "Route", "deleteRoute", "1"])
    )

    expect(proxyResponse.status).toBe(403)
    expect(backendFetchMock).not.toHaveBeenCalled()
  })
})
