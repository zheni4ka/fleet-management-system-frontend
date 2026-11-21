import { describe, expect, it } from "vitest"
import {
  createCreateRouteRequestModel,
  createEmptyAddRouteFormValues,
  getRouteScheduleFormValidationError,
} from "@/lib/forms/route-form"
import {
  formatRouteCitySelection,
  getIsSameRouteCity,
} from "@/lib/forms/route-city-selection"
import {
  AddRouteFormValues,
  FormValidationError,
  RouteCitySelection,
} from "@/lib/types"

const kyivCity: RouteCitySelection = {
  locationId: 1,
  geoNamesId: null,
  city: "Kyiv",
  region: null,
  country: "Ukraine",
  timeZoneId: "Europe/Kyiv",
}

const warsawCity: RouteCitySelection = {
  locationId: null,
  geoNamesId: 756135,
  city: "Warsaw",
  region: "Masovian Voivodeship",
  country: "Poland",
  timeZoneId: "Europe/Warsaw",
}

function createKyivToWarsawFormValues(
  changedValues: Partial<AddRouteFormValues>
): AddRouteFormValues {
  return {
    ...createEmptyAddRouteFormValues(),
    startCity: kyivCity,
    destinationCity: warsawCity,
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
      { startLocationId: 1, destinationLocationId: 24 }
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

describe("getRouteScheduleFormValidationError", () => {
  it("requires both times", () => {
    expect(
      getRouteScheduleFormValidationError(
        createKyivToWarsawFormValues({ arrivalLocalDateTime: "" })
      )
    ).toBe(FormValidationError.RouteRequiredFieldsMissing)
  })

  it("requires both cities", () => {
    expect(
      getRouteScheduleFormValidationError(
        createKyivToWarsawFormValues({ destinationCity: null })
      )
    ).toBe(FormValidationError.RouteRequiredFieldsMissing)
  })

  it("rejects the same start and destination", () => {
    expect(
      getRouteScheduleFormValidationError(
        createKyivToWarsawFormValues({ destinationCity: kyivCity })
      )
    ).toBe(FormValidationError.SameStartAndDestinationLocation)
  })

  it("compares UTC instants, so an arrival that looks later on the wall clock can still be earlier", () => {
    expect(
      getRouteScheduleFormValidationError(
        createKyivToWarsawFormValues({
          startCity: warsawCity,
          destinationCity: kyivCity,
          departureLocalDateTime: "2026-12-01T08:30",
          arrivalLocalDateTime: "2026-12-01T09:15",
        })
      )
    ).toBe(FormValidationError.ArrivalNotAfterDeparture)
  })

  it("accepts a valid route", () => {
    expect(
      getRouteScheduleFormValidationError(createKyivToWarsawFormValues({}))
    ).toBeNull()
  })
})

describe("route city selection", () => {
  it("treats two picks of the same GeoNames city as the same city", () => {
    expect(getIsSameRouteCity(warsawCity, { ...warsawCity })).toBe(true)
  })

  it("cannot tell a saved location from an unsaved city apart, so leaves that check to the API", () => {
    expect(getIsSameRouteCity(kyivCity, warsawCity)).toBe(false)
  })

  it("shows the region only when the city has one", () => {
    expect(formatRouteCitySelection(kyivCity)).toBe("Kyiv, Ukraine")
    expect(formatRouteCitySelection(warsawCity)).toBe(
      "Warsaw, Masovian Voivodeship, Poland"
    )
  })
})
