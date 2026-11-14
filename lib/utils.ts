import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isMatchingSearchQuery(
  searchQuery: string,
  searchableFields: ReadonlyArray<string | null>
): boolean {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  if (normalizedSearchQuery === "") {
    return true
  }
  return searchableFields.some(
    (searchableField) =>
      searchableField !== null &&
      searchableField.toLowerCase().includes(normalizedSearchQuery)
  )
}

export function parseEnumValue<TEnumValue extends string>(
  enumObject: Record<string, TEnumValue>,
  rawValue: string
): TEnumValue {
  const matchingEnumValue = Object.values(enumObject).find(
    (enumValue) => enumValue === rawValue
  )
  if (matchingEnumValue === undefined) {
    throw new Error(`Невідоме значення переліку: "${rawValue}"`)
  }
  return matchingEnumValue
}
