import { describe, expect, it } from "vitest"
import {
  createCreateAutoMaintenanceRequestModel,
  createEmptyMaintenanceFormValues,
  getMaintenanceFormFieldErrors,
} from "@/lib/forms/maintenance-form"
import { FormValidationError } from "@/lib/types"

describe("maintenance form", () => {
  const filledMaintenanceFormValues = {
    ...createEmptyMaintenanceFormValues(),
    name: " ТО-1 ",
    description: "Заміна мастила",
    serviceDate: "2030-01-10T09:00",
  }

  it("accepts maintenance without a planned end", () => {
    expect(getMaintenanceFormFieldErrors(filledMaintenanceFormValues)).toEqual(
      {}
    )
  })

  it("requires the service date", () => {
    expect(
      getMaintenanceFormFieldErrors({
        ...filledMaintenanceFormValues,
        serviceDate: "",
      })
    ).toEqual({ serviceDate: FormValidationError.RequiredFieldMissing })
  })

  it("rejects a planned end that is not after the start", () => {
    expect(
      getMaintenanceFormFieldErrors({
        ...filledMaintenanceFormValues,
        plannedEndDate: "2030-01-10T09:00",
      })
    ).toEqual({
      plannedEndDate: FormValidationError.MaintenancePlannedEndNotAfterStart,
    })
  })

  it("sends an empty planned end as null", () => {
    expect(
      createCreateAutoMaintenanceRequestModel(7, filledMaintenanceFormValues)
    ).toEqual({
      name: "ТО-1",
      description: "Заміна мастила",
      serviceDate: "2030-01-10T09:00",
      plannedEndDate: null,
      autoId: 7,
    })
  })

  it("sends a filled planned end as entered", () => {
    expect(
      createCreateAutoMaintenanceRequestModel(7, {
        ...filledMaintenanceFormValues,
        plannedEndDate: "2030-01-12T18:00",
      }).plannedEndDate
    ).toBe("2030-01-12T18:00")
  })
})
