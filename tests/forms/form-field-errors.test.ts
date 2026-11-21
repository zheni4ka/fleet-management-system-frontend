import { describe, expect, it } from "vitest"
import {
  getRequiredFieldErrors,
  hasFormFieldErrors,
  mapApiFieldErrorMessages,
  normalizeApiPropertyName,
} from "@/lib/forms/form-field-errors"
import {
  createEmptyDispatcherFormValues,
  getDispatcherFormFieldErrors,
} from "@/lib/forms/dispatcher-form"
import { FormValidationError } from "@/lib/types"

describe("getRequiredFieldErrors", () => {
  it("marks only the required fields that are empty or whitespace", () => {
    const autoFormValues = { mark: " ", model: "FH16", color: "" }

    expect(getRequiredFieldErrors(autoFormValues, ["mark", "model"])).toEqual({
      mark: FormValidationError.RequiredFieldMissing,
    })
  })
})

describe("hasFormFieldErrors", () => {
  it("ignores fields without an error", () => {
    expect(hasFormFieldErrors({ mark: undefined })).toBe(false)
    expect(hasFormFieldErrors({ mark: "Заповніть це поле." })).toBe(true)
  })
})

describe("normalizeApiPropertyName", () => {
  it.each([
    ["Number", "number"],
    ["DepartureTimeUtc", "departureTimeUtc"],
    ["DepotIds[0]", "depotIds"],
    ["Address.City", "address"],
  ])("turns %s into %s", (apiPropertyName, normalizedPropertyName) => {
    expect(normalizeApiPropertyName(apiPropertyName)).toBe(
      normalizedPropertyName
    )
  })
})

describe("mapApiFieldErrorMessages", () => {
  it("puts API messages on the matching form fields and drops unknown ones", () => {
    expect(
      mapApiFieldErrorMessages(
        {
          DepartureTimeUtc: [
            "Час відправлення має бути раніше за час прибуття.",
          ],
          StartLocationId: ["Поле «Початкова локація» має бути більшим за 0."],
          "": ["Час відправлення та час прибуття потрібно передавати разом."],
        },
        {
          departureTimeUtc: "departureLocalDateTime",
          startLocationId: "startCity",
        }
      )
    ).toEqual({
      departureLocalDateTime:
        "Час відправлення має бути раніше за час прибуття.",
      startCity: "Поле «Початкова локація» має бути більшим за 0.",
    })
  })

  it("joins several messages for one field", () => {
    expect(
      mapApiFieldErrorMessages(
        { "DepotIds[0]": ["Перше."], "DepotIds[1]": ["Друге."] },
        { depotIds: "depotIds" }
      )
    ).toEqual({ depotIds: "Перше. Друге." })
  })
})

describe("getDispatcherFormFieldErrors", () => {
  it("marks empty fields and a missing depot", () => {
    expect(
      getDispatcherFormFieldErrors(createEmptyDispatcherFormValues())
    ).toEqual({
      username: FormValidationError.RequiredFieldMissing,
      email: FormValidationError.RequiredFieldMissing,
      depotIds: FormValidationError.DispatcherDepotsMissing,
    })
  })

  it("rejects an email without a domain", () => {
    expect(
      getDispatcherFormFieldErrors({
        username: "dispatcher_1",
        email: "dispatcher@fleet",
        password: "",
        depotIds: [1],
      })
    ).toEqual({ email: FormValidationError.EmailAddressInvalid })
  })
})
