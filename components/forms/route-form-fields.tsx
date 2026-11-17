import { useTranslations } from "next-intl"
import { FormField } from "@/components/ui/form-field"
import { SearchableSelect } from "@/components/ui/searchable-select"
import {
  createAutoSearchableSelectOptions,
  createDriverSearchableSelectOptions,
  createLocationSearchableSelectOptions,
} from "@/lib/forms/searchable-select-options"
import {
  AutoLookupOption,
  DriverLookupOption,
  LocationLookupOption,
  RouteAssignmentFormValues,
} from "@/lib/types"

interface RouteFormFieldsProps<
  TRouteFormValues extends RouteAssignmentFormValues,
> {
  routeFormValues: TRouteFormValues
  onRouteFormValuesChange: (routeFormValues: TRouteFormValues) => void
  autoLookupOptions: ReadonlyArray<AutoLookupOption>
  driverLookupOptions: ReadonlyArray<DriverLookupOption>
  locationLookupOptions: ReadonlyArray<LocationLookupOption>
  alwaysSelectableAutoId: number | null
}

export function RouteFormFields<
  TRouteFormValues extends RouteAssignmentFormValues,
>({
  routeFormValues,
  onRouteFormValuesChange,
  autoLookupOptions,
  driverLookupOptions,
  locationLookupOptions,
  alwaysSelectableAutoId,
}: RouteFormFieldsProps<TRouteFormValues>) {
  const autoStatusTranslations = useTranslations("autoStatus")
  const routeTranslations = useTranslations("routes")
  const locationOptions = createLocationSearchableSelectOptions(
    locationLookupOptions
  )
  const selectedAutoLookupOption = autoLookupOptions.find(
    (autoLookupOption) => String(autoLookupOption.id) === routeFormValues.autoId
  )
  const selectableDriverLookupOptions =
    selectedAutoLookupOption === undefined
      ? driverLookupOptions
      : driverLookupOptions.filter(
          (driverLookupOption) =>
            driverLookupOption.depotId === selectedAutoLookupOption.depotId
        )

  const updateRouteAssignmentFormValues = (
    changedValues: Partial<RouteAssignmentFormValues>
  ) => {
    onRouteFormValuesChange({ ...routeFormValues, ...changedValues })
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label={routeTranslations("startLocationLabel")}>
          <SearchableSelect
            options={locationOptions}
            selectedValue={routeFormValues.startLocationId}
            onSelectedValueChange={(startLocationId) =>
              updateRouteAssignmentFormValues({ startLocationId })
            }
            placeholder={routeTranslations("startLocationPlaceholder")}
            searchPlaceholder={routeTranslations("locationSearchPlaceholder")}
            emptyMessage={routeTranslations("locationEmptyMessage")}
          />
        </FormField>
        <FormField label={routeTranslations("destinationLocationLabel")}>
          <SearchableSelect
            options={locationOptions}
            selectedValue={routeFormValues.destinationLocationId}
            onSelectedValueChange={(destinationLocationId) =>
              updateRouteAssignmentFormValues({ destinationLocationId })
            }
            placeholder={routeTranslations("destinationLocationPlaceholder")}
            searchPlaceholder={routeTranslations("locationSearchPlaceholder")}
            emptyMessage={routeTranslations("locationEmptyMessage")}
          />
        </FormField>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label={routeTranslations("driverLabel")}>
          <SearchableSelect
            options={createDriverSearchableSelectOptions(
              selectableDriverLookupOptions
            )}
            selectedValue={routeFormValues.driverId}
            onSelectedValueChange={(driverId) =>
              updateRouteAssignmentFormValues({ driverId })
            }
            placeholder={routeTranslations("driverPlaceholder")}
            searchPlaceholder={routeTranslations("driverSearchPlaceholder")}
            emptyMessage={routeTranslations("driverEmptyMessage")}
          />
        </FormField>
        <FormField label={routeTranslations("autoLabel")}>
          <SearchableSelect
            options={createAutoSearchableSelectOptions(
              autoLookupOptions,
              alwaysSelectableAutoId,
              (autoStatus) => autoStatusTranslations(autoStatus)
            )}
            selectedValue={routeFormValues.autoId}
            onSelectedValueChange={(autoId) =>
              updateRouteAssignmentFormValues({ autoId })
            }
            placeholder={routeTranslations("autoPlaceholder")}
            searchPlaceholder={routeTranslations("autoSearchPlaceholder")}
            emptyMessage={routeTranslations("autoEmptyMessage")}
          />
        </FormField>
      </div>
    </>
  )
}
