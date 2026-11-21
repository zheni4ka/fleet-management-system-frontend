import {
  formatAutoTitleWithNumber,
  formatDriverFullName,
} from "@/lib/formatters"
import {
  AutoLookupOption,
  AutoStatus,
  DriverLookupOption,
  SearchableSelectOption,
} from "@/lib/types"

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
  alwaysSelectableAutoId: number | null,
  translateAutoStatus: (autoStatus: AutoStatus) => string
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
        ? translateAutoStatus(autoLookupOption.status)
        : null,
    }
  })
}
