import { describe, expect, it } from "vitest"
import {
  createCreateRouteRequestModel,
  createEmptyAddRouteFormValues,
  getRouteScheduleFormFieldErrors,
} from "@/lib/forms/route-form"
import {
  formatRouteCitySelection,
  getIsSameRouteCity,
} from "@/lib/forms/route-city-selection"
import {
  AddRouteFormValues,
  FormValidationError,
  RouteAddressSelection,
  RouteCitySelection,
} from "@/lib/types"

const kyivCity: RouteCitySelection = {
  locationId: 1,
  geoNamesId: null,
  city: "Kyiv",
  region: null,
  country: "Ukraine",
  timeZoneId: "Europe/Kyiv",
  latitude: 50.4501,
  longitude: 30.5234,
}

const warsawCity: RouteCitySelection = {
  locationId: null,
  geoNamesId: 756135,
  city: "Warsaw",
  region: "Masovian Voivodeship",
  country: "Poland",
  timeZoneId: "Europe/Warsaw",
  latitude: 52.2297,
  longitude: 21.0122,
}

const kyivAddress: RouteAddressSelection = {
  addressLine: "вулиця Хрещатик, 22",
  latitude: 50.4474,
  longitude: 30.5214,
}

const warsawAddress: RouteAddressSelection = {
  addressLine: "Marszałkowska, 10",
  latitude: 52.2216,
  longitude: 21.0168,
}

function createKyivToWarsawFormValues(
  changedValues: Partial<AddRouteFormValues>
): AddRouteFormValues {
  return {
    ...createEmptyAddRouteFormValues(),
    startCity: kyivCity,
    startAddress: kyivAddress,
    destinationCity: warsawCity,
    destinationAddress: warsawAddress,
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
      startAddressLine: "вулиця Хрещатик, 22",
      startAddressLatitude: 50.4474,
      destinationAddressLine: "Marszałkowska, 10",
      destinationAddressLongitude: 21.0168,
    })
  })
})

describe("getRouteScheduleFormFieldErrors", () => {
  it("marks missing addresses on their own fields", () => {
    expect(
      getRouteScheduleFormFieldErrors(
        createKyivToWarsawFormValues({
          startAddress: null,
          destinationAddress: null,
        })
      )
    ).toEqual({
      startAddress: FormValidationError.RequiredFieldMissing,
      destinationAddress: FormValidationError.RequiredFieldMissing,
    })
  })

  it("marks a missing arrival time on the arrival field", () => {
    expect(
      getRouteScheduleFormFieldErrors(
        createKyivToWarsawFormValues({ arrivalLocalDateTime: "" })
      )
    ).toEqual({
      arrivalLocalDateTime: FormValidationError.RequiredFieldMissing,
    })
  })

  it("marks a missing destination city on the destination field", () => {
    expect(
      getRouteScheduleFormFieldErrors(
        createKyivToWarsawFormValues({ destinationCity: null })
      )
    ).toEqual({ destinationCity: FormValidationError.RequiredFieldMissing })
  })

  it("marks the same start and destination on the destination field", () => {
    expect(
      getRouteScheduleFormFieldErrors(
        createKyivToWarsawFormValues({ destinationCity: kyivCity })
      )
    ).toEqual({
      destinationCity: FormValidationError.SameStartAndDestinationLocation,
    })
  })

  it("compares UTC instants, so an arrival that looks later on the wall clock can still be earlier", () => {
    expect(
      getRouteScheduleFormFieldErrors(
        createKyivToWarsawFormValues({
          startCity: warsawCity,
          destinationCity: kyivCity,
          departureLocalDateTime: "2026-12-01T08:30",
          arrivalLocalDateTime: "2026-12-01T09:15",
        })
      )
    ).toEqual({
      arrivalLocalDateTime: FormValidationError.ArrivalNotAfterDeparture,
    })
  })

  it("accepts a valid route", () => {
    expect(
      getRouteScheduleFormFieldErrors(createKyivToWarsawFormValues({}))
    ).toEqual({})
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
