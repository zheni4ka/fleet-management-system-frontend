import { autoStatusLabels } from "@/lib/constants"
import {
  formatAutoTitleWithNumber,
  formatDriverFullName,
  formatLocationName,
} from "@/lib/formatters"
import {
  Auto,
  AutoStatus,
  Driver,
  Location,
  SearchableSelectOption,
} from "@/lib/types"

export function createLocationSearchableSelectOptions(
  locations: ReadonlyArray<Location>
): ReadonlyArray<SearchableSelectOption> {
  return locations.map((location) => ({
    value: String(location.id),
    label: formatLocationName(location),
    isDisabled: false,
    disabledReason: null,
  }))
}

export function createDriverSearchableSelectOptions(
  drivers: ReadonlyArray<Driver>
): ReadonlyArray<SearchableSelectOption> {
  return drivers.map((driver) => ({
    value: String(driver.id),
    label: `${formatDriverFullName(driver)} (${driver.licenseNumber})`,
    isDisabled: false,
    disabledReason: null,
  }))
}

export function createAutoSearchableSelectOptions(
  autos: ReadonlyArray<Auto>,
  alwaysSelectableAutoId: number | null
): ReadonlyArray<SearchableSelectOption> {
  return autos.map((auto) => {
    const isAutoUnavailable =
      auto.status === AutoStatus.UnderMaintenance &&
      auto.id !== alwaysSelectableAutoId
    return {
      value: String(auto.id),
      label: formatAutoTitleWithNumber(auto),
      isDisabled: isAutoUnavailable,
      disabledReason: isAutoUnavailable ? autoStatusLabels[auto.status] : null,
    }
  })
}
