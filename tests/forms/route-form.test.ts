import { describe, expect, it } from "vitest"
import { routeFormValidationMessages } from "@/lib/constants"
import {
  createCreateRouteRequestModel,
  createEmptyAddRouteFormValues,
  getAddRouteFormValidationError,
} from "@/lib/forms/route-form"
import { AddRouteFormValues, LocationLookupOption } from "@/lib/types"

const locationLookupOptions: ReadonlyArray<LocationLookupOption> = [
  { id: 1, city: "Kyiv", country: "Ukraine", timeZoneId: "Europe/Kyiv" },
  { id: 24, city: "Warsaw", country: "Poland", timeZoneId: "Europe/Warsaw" },
]

function createKyivToWarsawFormValues(
  changedValues: Partial<AddRouteFormValues>
): AddRouteFormValues {
  return {
    ...createEmptyAddRouteFormValues(),
    startLocationId: "1",
    destinationLocationId: "24",
    autoId: "5",
    driverId: "7",
    departureLocalDateTime: "2026-12-01T08:00",
    arrivalLocalDateTime: "2026-12-01T18:00",
    ...changedValues,
  }
}

describe("createCreateRouteRequestModel", () => {
  it("converts departure from the start zone and arrival from the destination zone to UTC", () => {
    const createRouteRequestModel = createCreateRouteRequestModel(
      createKyivToWarsawFormValues({}),
      locationLookupOptions
    )

    expect(createRouteRequestModel).toMatchObject({
      startLocationId: 1,
      destinationLocationId: 24,
      autoId: 5,
      driverId: 7,
      departureTimeUtc: "2026-12-01T06:00:00.000Z",
      arrivalTimeUtc: "2026-12-01T17:00:00.000Z",
    })
  })
})

describe("getAddRouteFormValidationError", () => {
  it("requires both times", () => {
    expect(
      getAddRouteFormValidationError(
        createKyivToWarsawFormValues({ arrivalLocalDateTime: "" }),
        locationLookupOptions
      )
    ).toBe(routeFormValidationMessages.requiredFieldsMissing)
  })

  it("rejects the same start and destination", () => {
    expect(
      getAddRouteFormValidationError(
        createKyivToWarsawFormValues({ destinationLocationId: "1" }),
        locationLookupOptions
      )
    ).toBe(routeFormValidationMessages.sameStartAndDestinationLocation)
  })

  it("compares UTC instants, so an arrival that looks later on the wall clock can still be earlier", () => {
    expect(
      getAddRouteFormValidationError(
        createKyivToWarsawFormValues({
          startLocationId: "24",
          destinationLocationId: "1",
          departureLocalDateTime: "2026-12-01T08:30",
          arrivalLocalDateTime: "2026-12-01T09:15",
        }),
        locationLookupOptions
      )
    ).toBe(routeFormValidationMessages.arrivalNotAfterDeparture)
  })

  it("accepts a valid route", () => {
    expect(
      getAddRouteFormValidationError(
        createKyivToWarsawFormValues({}),
        locationLookupOptions
      )
    ).toBeNull()
  })
})
