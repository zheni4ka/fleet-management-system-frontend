import { describe, expect, it } from "vitest"
import {
  createCreateAutoRequestModel,
  createEmptyAutoFormValues,
  getAutoFormValidationError,
} from "@/lib/forms/auto-form"
import {
  createDriverRequestBody,
  createEmptyDriverFormValues,
  getDriverFormValidationError,
} from "@/lib/forms/driver-form"
import {
  createEmptyLocationFormValues,
  createLocationRequestBody,
  getLocationFormValidationError,
} from "@/lib/forms/location-form"
import { getPasswordPolicyViolation } from "@/lib/forms/password-policy"
import { FormValidationError, PasswordPolicyViolation } from "@/lib/types"

describe("auto form", () => {
  const filledAutoFormValues = {
    ...createEmptyAutoFormValues(),
    mark: " Volvo ",
    model: "FH16",
    color: "Білий",
    number: " АА1111АА ",
    capacity: "20",
    depotId: "1",
  }

  it("requires a depot", () => {
    expect(
      getAutoFormValidationError({ ...filledAutoFormValues, depotId: "" })
    ).not.toBeNull()
  })

  it("rejects a non-positive capacity", () => {
    expect(
      getAutoFormValidationError({ ...filledAutoFormValues, capacity: "0" })
    ).toBe(FormValidationError.AutoCapacityNotPositive)
  })

  it("trims text and converts numbers for the request", () => {
    expect(createCreateAutoRequestModel(filledAutoFormValues)).toEqual({
      mark: "Volvo",
      model: "FH16",
      color: "Білий",
      number: "АА1111АА",
      capacity: 20,
      depotId: 1,
    })
  })
})

describe("driver form", () => {
  it("requires every field including the depot", () => {
    expect(
      getDriverFormValidationError(createEmptyDriverFormValues())
    ).not.toBeNull()
  })

  it("sends the depot as a number", () => {
    expect(
      createDriverRequestBody({
        name: " Тарас ",
        surname: "Шевченко",
        patronymic: "Григорович",
        licenseNumber: "ABC 111111",
        depotId: "2",
      })
    ).toEqual({
      name: "Тарас",
      surname: "Шевченко",
      patronymic: "Григорович",
      licenseNumber: "ABC 111111",
      depotId: 2,
    })
  })
})

describe("location form", () => {
  it("requires a time zone", () => {
    expect(
      getLocationFormValidationError({
        ...createEmptyLocationFormValues(),
        city: "Lviv",
        country: "Ukraine",
      })
    ).not.toBeNull()
  })

  it("keeps the selected time zone", () => {
    expect(
      createLocationRequestBody({
        city: " Lviv ",
        country: " Ukraine ",
        timeZoneId: "Europe/Kyiv",
      })
    ).toEqual({ city: "Lviv", country: "Ukraine", timeZoneId: "Europe/Kyiv" })
  })
})

describe("password policy", () => {
  it.each([
    ["Short1A", PasswordPolicyViolation.TooShort],
    ["longpassword1", PasswordPolicyViolation.UppercaseLetterMissing],
    ["LONGPASSWORD1", PasswordPolicyViolation.LowercaseLetterMissing],
    ["LongPasswordNoDigit", PasswordPolicyViolation.DigitMissing],
  ])("rejects %s", (password, expectedPasswordPolicyViolation) => {
    expect(getPasswordPolicyViolation(password)).toBe(
      expectedPasswordPolicyViolation
    )
  })

  it("accepts a password that satisfies the backend policy", () => {
    expect(getPasswordPolicyViolation("Valid1Password")).toBeNull()
  })
})
