import { getRequiredFieldErrors } from "@/lib/forms/form-field-errors"
import {
  Auto,
  AutoFormValues,
  CreateAutoRequestModel,
  FormFieldErrors,
  FormValidationError,
  UpdateAutoRequestModel,
} from "@/lib/types"

export function createEmptyAutoFormValues(): AutoFormValues {
  return {
    mark: "",
    model: "",
    color: "",
    number: "",
    capacity: "",
    depotId: "",
  }
}

export function createAutoFormValuesFromAuto(auto: Auto): AutoFormValues {
  return {
    mark: auto.mark,
    model: auto.model,
    color: auto.color,
    number: auto.number,
    capacity: String(auto.capacity),
    depotId: String(auto.depotId),
  }
}

function parseAutoCapacity(rawCapacity: string): number | null {
  const parsedCapacity = Number(rawCapacity.trim())
  if (!Number.isFinite(parsedCapacity) || parsedCapacity <= 0) {
    return null
  }
  return parsedCapacity
}

export function getAutoFormFieldErrors(
  autoFormValues: AutoFormValues
): FormFieldErrors<keyof AutoFormValues> {
  const requiredFieldErrors = getRequiredFieldErrors(autoFormValues, [
    "mark",
    "model",
    "color",
    "number",
    "capacity",
    "depotId",
  ])
  if (
    requiredFieldErrors.capacity === undefined &&
    parseAutoCapacity(autoFormValues.capacity) === null
  ) {
    return {
      ...requiredFieldErrors,
      capacity: FormValidationError.AutoCapacityNotPositive,
    }
  }
  return requiredFieldErrors
}

export function createCreateAutoRequestModel(
  autoFormValues: AutoFormValues
): CreateAutoRequestModel {
  const autoCapacity = parseAutoCapacity(autoFormValues.capacity)
  if (autoCapacity === null) {
    throw new Error(`Invalid auto capacity: "${autoFormValues.capacity}"`)
  }
  return {
    mark: autoFormValues.mark.trim(),
    model: autoFormValues.model.trim(),
    color: autoFormValues.color,
    number: autoFormValues.number.trim(),
    capacity: autoCapacity,
    depotId: Number(autoFormValues.depotId),
  }
}

export function createUpdateAutoRequestModel(
  auto: Auto,
  autoFormValues: AutoFormValues
): UpdateAutoRequestModel {
  return {
    id: auto.id,
    rowVersion: auto.rowVersion,
    ...createCreateAutoRequestModel(autoFormValues),
  }
}
