import { Auto, AutoFormValues, AutoStatus } from "@/lib/types"

export function createEmptyAutoFormValues(): AutoFormValues {
  return {
    mark: "",
    model: "",
    color: "",
    number: "",
    capacity: "",
    status: AutoStatus.Available,
  }
}

export function createAutoFormValuesFromAuto(auto: Auto): AutoFormValues {
  return {
    mark: auto.mark,
    model: auto.model,
    color: auto.color,
    number: auto.number,
    capacity: String(auto.capacity),
    status: auto.status,
  }
}

function parseAutoCapacity(rawCapacity: string): number | null {
  const parsedCapacity = Number(rawCapacity.trim())
  if (!Number.isInteger(parsedCapacity) || parsedCapacity <= 0) {
    return null
  }
  return parsedCapacity
}

export function getAutoFormValidationError(
  autoFormValues: AutoFormValues
): string | null {
  const hasEmptyRequiredField = [
    autoFormValues.mark,
    autoFormValues.model,
    autoFormValues.color,
    autoFormValues.number,
  ].some((requiredFieldValue) => requiredFieldValue.trim() === "")
  if (hasEmptyRequiredField) {
    return "Будь ласка, заповніть всі поля форми."
  }
  if (parseAutoCapacity(autoFormValues.capacity) === null) {
    return "Місткість має бути додатним цілим числом."
  }
  return null
}

export function createAutoRequestBody(
  autoFormValues: AutoFormValues
): Omit<Auto, "id"> {
  const autoCapacity = parseAutoCapacity(autoFormValues.capacity)
  if (autoCapacity === null) {
    throw new Error(
      `Некоректна місткість автомобіля: "${autoFormValues.capacity}"`
    )
  }
  return {
    mark: autoFormValues.mark.trim(),
    model: autoFormValues.model.trim(),
    color: autoFormValues.color,
    number: autoFormValues.number.trim(),
    capacity: autoCapacity,
    status: autoFormValues.status,
  }
}
