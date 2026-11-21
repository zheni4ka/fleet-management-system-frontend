import { describe, expect, it } from "vitest"
import {
  createCreateAutoRequestModel,
  createEmptyAutoFormValues,
  getAutoFormFieldErrors,
} from "@/lib/forms/auto-form"
import {
  createDriverRequestBody,
  createEmptyDriverFormValues,
  getDriverFormFieldErrors,
} from "@/lib/forms/driver-form"
import { getPasswordPolicyViolation } from "@/lib/forms/password-policy"
import { createRoutesPeriodFormValuesFromPageSearchParams } from "@/lib/forms/routes-period-form"
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

  it("accepts a filled vehicle", () => {
    expect(getAutoFormFieldErrors(filledAutoFormValues)).toEqual({})
  })

  it("marks a missing depot on the depot field", () => {
    expect(
      getAutoFormFieldErrors({ ...filledAutoFormValues, depotId: "" })
    ).toEqual({ depotId: FormValidationError.RequiredFieldMissing })
  })

  it("marks a non-positive capacity on the capacity field", () => {
    expect(
      getAutoFormFieldErrors({ ...filledAutoFormValues, capacity: "0" })
    ).toEqual({ capacity: FormValidationError.AutoCapacityNotPositive })
  })

  it("reports an empty capacity as missing, not as non-positive", () => {
    expect(
      getAutoFormFieldErrors({ ...filledAutoFormValues, capacity: " " })
    ).toEqual({ capacity: FormValidationError.RequiredFieldMissing })
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
  it("marks every empty field including the depot", () => {
    expect(
      Object.keys(getDriverFormFieldErrors(createEmptyDriverFormValues()))
    ).toEqual(["name", "surname", "patronymic", "licenseNumber", "depotId"])
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

describe("routes period form", () => {
  it("drops dates that are not real calendar dates", () => {
    expect(
      createRoutesPeriodFormValuesFromPageSearchParams({
        periodStartDate: "2026-11-01",
        periodEndDate: "2026-11-31",
      })
    ).toEqual({ periodStartDate: "2026-11-01", periodEndDate: "" })
  })
})
