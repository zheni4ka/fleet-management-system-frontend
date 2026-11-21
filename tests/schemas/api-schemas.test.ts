import { describe, expect, it } from "vitest"
import { auditLogSchema } from "@/lib/schemas/audit-log-schema"
import { cityGeocodingCandidatesSchema } from "@/lib/schemas/city-geocoding-candidate-schema"
import { dispatcherSchema } from "@/lib/schemas/dispatcher-schema"
import { routeSchema } from "@/lib/schemas/route-schema"
import { sessionResponseSchema } from "@/lib/schemas/session-response-schema"
import { AuditAction, RouteStatus } from "@/lib/types"

const validRouteResponse = {
  id: 1,
  startLocationId: 1,
  startLocationCity: "Kyiv",
  startLocationCountry: "Ukraine",
  startLocationTimeZoneId: "Europe/Kyiv",
  startLocationLatitude: 50.45466,
  startLocationLongitude: 30.5238,
  destinationLocationId: 24,
  destinationLocationCity: "Warsaw",
  destinationLocationCountry: "Poland",
  destinationLocationTimeZoneId: "Europe/Warsaw",
  destinationLocationLatitude: null,
  destinationLocationLongitude: null,
  departureTimeUtc: "2026-12-01T06:00:00Z",
  arrivalTimeUtc: "2026-12-01T17:00:00Z",
  autoId: 5,
  autoMark: "Volvo",
  autoModel: "FH16",
  autoNumber: "АА1111АА",
  driverId: 7,
  driverName: "Тарас",
  driverSurname: "Шевченко",
  status: RouteStatus.Planned,
  depotId: 1,
  depotName: "Основне депо",
  rowVersion: "AAAAAAAAB9E=",
}

describe("routeSchema", () => {
  it("accepts a route response from the API", () => {
    expect(routeSchema.safeParse(validRouteResponse).success).toBe(true)
  })

  it("rejects a route without a row version", () => {
    const { rowVersion, ...routeResponseWithoutRowVersion } = validRouteResponse
    expect(rowVersion).not.toBe("")
    expect(routeSchema.safeParse(routeResponseWithoutRowVersion).success).toBe(
      false
    )
  })

  it("rejects wall-clock times without a UTC designator", () => {
    expect(
      routeSchema.safeParse({
        ...validRouteResponse,
        departureTimeUtc: "2026-12-01T08:00:00",
      }).success
    ).toBe(false)
  })
})

describe("cityGeocodingCandidatesSchema", () => {
  it("accepts a city without a region or population", () => {
    expect(
      cityGeocodingCandidatesSchema.safeParse([
        {
          geoNamesId: 702550,
          city: "Lviv",
          region: null,
          country: "Ukraine",
          countryCode: "UA",
          latitude: 49.83826,
          longitude: 24.02324,
          timeZoneId: "Europe/Kyiv",
          population: null,
        },
      ]).success
    ).toBe(true)
  })
})

describe("sessionResponseSchema", () => {
  it("requires both tokens and their expiry times", () => {
    expect(
      sessionResponseSchema.safeParse({
        accessToken: "access",
        accessTokenExpiresAtUtc: "2026-12-01T06:15:00+00:00",
        refreshToken: "refresh",
        refreshTokenExpiresAtUtc: "2026-12-08T06:00:00+00:00",
        username: "admin",
        email: null,
        roles: ["Admin"],
        preferredLanguage: "uk",
      }).success
    ).toBe(true)
    expect(
      sessionResponseSchema.safeParse({ accessToken: "access" }).success
    ).toBe(false)
  })
})

describe("dispatcherSchema", () => {
  it("requires depot ids and the deactivation flag", () => {
    expect(
      dispatcherSchema.safeParse({
        id: "u1",
        username: "d1",
        email: null,
        isDeactivated: false,
        depotIds: [1],
      }).success
    ).toBe(true)
    expect(
      dispatcherSchema.safeParse({ id: "u1", username: "d1", email: null })
        .success
    ).toBe(false)
  })
})

describe("auditLogSchema", () => {
  it("rejects unknown audit actions", () => {
    const auditLogResponse = {
      id: 1,
      dispatcherId: null,
      dispatcherUsername: null,
      time: "2026-12-01T06:00:00Z",
      action: AuditAction.AutoUpdated,
      entityId: "5",
      changes: [
        {
          propertyName: "Mark",
          previousValue: "Volvo",
          currentValue: "Scania",
        },
      ],
    }
    expect(auditLogSchema.safeParse(auditLogResponse).success).toBe(true)
    expect(
      auditLogSchema.safeParse({ ...auditLogResponse, action: "SomethingElse" })
        .success
    ).toBe(false)
  })
})
