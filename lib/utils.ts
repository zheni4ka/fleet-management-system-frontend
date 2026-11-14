import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseEnumValue<TEnumValue extends string>(
  enumObject: Record<string, TEnumValue>,
  rawValue: string
): TEnumValue {
  const matchingEnumValue = findEnumValue(enumObject, rawValue)
  if (matchingEnumValue === null) {
    throw new Error(`Невідоме значення переліку: "${rawValue}"`)
  }
  return matchingEnumValue
}

export function findEnumValue<TEnumValue extends string>(
  enumObject: Record<string, TEnumValue>,
  rawValue: string
): TEnumValue | null {
  return (
    Object.values(enumObject).find((enumValue) => enumValue === rawValue) ??
    null
  )
}
