import { defaultAppLocale } from "@/lib/constants"
import { AppLocale } from "@/lib/types"
import { findEnumValue } from "@/lib/utils"

export function resolveAppLocale(rawLocale: string | undefined): AppLocale {
  if (rawLocale === undefined) {
    return defaultAppLocale
  }
  return findEnumValue(AppLocale, rawLocale) ?? defaultAppLocale
}
