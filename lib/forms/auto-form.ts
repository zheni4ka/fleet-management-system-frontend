import {
  Auto,
  AutoFormValues,
  CreateAutoRequestModel,
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

export function getAutoFormValidationError(
  autoFormValues: AutoFormValues
): FormValidationError | null {
  const hasEmptyRequiredField = [
    autoFormValues.mark,
    autoFormValues.model,
    autoFormValues.color,
    autoFormValues.number,
    autoFormValues.depotId,
  ].some((requiredFieldValue) => requiredFieldValue.trim() === "")
  if (hasEmptyRequiredField) {
    return FormValidationError.AutoRequiredFieldsMissing
  }
  if (parseAutoCapacity(autoFormValues.capacity) === null) {
    return FormValidationError.AutoCapacityNotPositive
  }
  return null
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
