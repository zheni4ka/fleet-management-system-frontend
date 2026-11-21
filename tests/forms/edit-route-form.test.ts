import { describe, expect, it } from "vitest"
import {
  createEditRouteFormValuesFromRoute,
  createUpdateRouteRequestModel,
  getEditRouteFormFieldErrors,
} from "@/lib/forms/edit-route-form"
import { FormValidationError, Route, RouteStatus } from "@/lib/types"

const plannedRoute: Route = {
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
  destinationLocationLatitude: 52.22977,
  destinationLocationLongitude: 21.01178,
  departureTimeUtc: "2026-12-01T06:00:00Z",
  arrivalTimeUtc: "2026-12-01T17:00:00Z",
  actualDepartureTimeUtc: null,
  actualArrivalTimeUtc: null,
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

const routeLocationIds = { startLocationId: 1, destinationLocationId: 24 }

describe("edit route form", () => {
  it("fills route times in each location's time zone", () => {
    const editRouteFormValues = createEditRouteFormValuesFromRoute(plannedRoute)

    expect(editRouteFormValues.departureLocalDateTime).toBe("2026-12-01T08:00")
    expect(editRouteFormValues.arrivalLocalDateTime).toBe("2026-12-01T18:00")
  })

  it("sends rescheduled times of a planned route in UTC", () => {
    const updateRouteRequestModel = createUpdateRouteRequestModel(
      plannedRoute,
      {
        ...createEditRouteFormValuesFromRoute(plannedRoute),
        departureLocalDateTime: "2026-12-02T09:30",
        arrivalLocalDateTime: "2026-12-02T19:00",
      },
      routeLocationIds
    )

    expect(updateRouteRequestModel.departureTimeUtc).toBe(
      "2026-12-02T07:30:00.000Z"
    )
    expect(updateRouteRequestModel.arrivalTimeUtc).toBe(
      "2026-12-02T18:00:00.000Z"
    )
  })

  it("does not send times for a route that is not planned", () => {
    const inProgressRoute = { ...plannedRoute, status: RouteStatus.InProgress }

    const updateRouteRequestModel = createUpdateRouteRequestModel(
      inProgressRoute,
      createEditRouteFormValuesFromRoute(inProgressRoute),
      routeLocationIds
    )

    expect(updateRouteRequestModel.departureTimeUtc).toBe(null)
    expect(updateRouteRequestModel.arrivalTimeUtc).toBe(null)
  })

  it("rejects a planned route arriving before it departs", () => {
    expect(
      getEditRouteFormFieldErrors(plannedRoute, {
        ...createEditRouteFormValuesFromRoute(plannedRoute),
        arrivalLocalDateTime: "2026-12-01T07:00",
      })
    ).toEqual({
      arrivalLocalDateTime: FormValidationError.ArrivalNotAfterDeparture,
    })
  })

  it("ignores times when validating a route that is not planned", () => {
    const inProgressRoute = { ...plannedRoute, status: RouteStatus.InProgress }

    expect(
      getEditRouteFormFieldErrors(inProgressRoute, {
        ...createEditRouteFormValuesFromRoute(inProgressRoute),
        arrivalLocalDateTime: "",
      })
    ).toEqual({})
  })
})
