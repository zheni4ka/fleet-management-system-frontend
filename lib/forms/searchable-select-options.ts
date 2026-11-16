import { autoStatusLabels } from "@/lib/constants"
import {
  formatAutoTitleWithNumber,
  formatDriverFullName,
  formatLocationName,
} from "@/lib/formatters"
import {
  AutoLookupOption,
  AutoStatus,
  DriverLookupOption,
  LocationLookupOption,
  SearchableSelectOption,
} from "@/lib/types"

export function createLocationSearchableSelectOptions(
  locationLookupOptions: ReadonlyArray<LocationLookupOption>
): ReadonlyArray<SearchableSelectOption> {
  return locationLookupOptions.map((locationLookupOption) => ({
    value: String(locationLookupOption.id),
    label: formatLocationName(locationLookupOption),
    isDisabled: false,
    disabledReason: null,
  }))
}

export function createDriverSearchableSelectOptions(
  driverLookupOptions: ReadonlyArray<DriverLookupOption>
): ReadonlyArray<SearchableSelectOption> {
  return driverLookupOptions.map((driverLookupOption) => ({
    value: String(driverLookupOption.id),
    label: `${formatDriverFullName(driverLookupOption)} (${driverLookupOption.licenseNumber})`,
    isDisabled: false,
    disabledReason: null,
  }))
}

export function createAutoSearchableSelectOptions(
  autoLookupOptions: ReadonlyArray<AutoLookupOption>,
  alwaysSelectableAutoId: number | null
): ReadonlyArray<SearchableSelectOption> {
  return autoLookupOptions.map((autoLookupOption) => {
    const isAutoUnavailable =
      autoLookupOption.status === AutoStatus.UnderMaintenance &&
      autoLookupOption.id !== alwaysSelectableAutoId
    return {
      value: String(autoLookupOption.id),
      label: formatAutoTitleWithNumber(autoLookupOption),
      isDisabled: isAutoUnavailable,
      disabledReason: isAutoUnavailable
        ? autoStatusLabels[autoLookupOption.status]
        : null,
    }
  })
}
