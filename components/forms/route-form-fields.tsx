import { FormField } from "@/components/ui/form-field"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { routeFormSelectTexts } from "@/lib/constants"
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
  const locationOptions = createLocationSearchableSelectOptions(
    locationLookupOptions
  )

  const updateRouteAssignmentFormValues = (
    changedValues: Partial<RouteAssignmentFormValues>
  ) => {
    onRouteFormValuesChange({ ...routeFormValues, ...changedValues })
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Початкова локація">
          <SearchableSelect
            options={locationOptions}
            selectedValue={routeFormValues.startLocationId}
            onSelectedValueChange={(startLocationId) =>
              updateRouteAssignmentFormValues({ startLocationId })
            }
            placeholder={routeFormSelectTexts.startLocationPlaceholder}
            searchPlaceholder={routeFormSelectTexts.locationSearchPlaceholder}
            emptyMessage={routeFormSelectTexts.locationEmptyMessage}
          />
        </FormField>
        <FormField label="Кінцева локація">
          <SearchableSelect
            options={locationOptions}
            selectedValue={routeFormValues.destinationLocationId}
            onSelectedValueChange={(destinationLocationId) =>
              updateRouteAssignmentFormValues({ destinationLocationId })
            }
            placeholder={routeFormSelectTexts.destinationLocationPlaceholder}
            searchPlaceholder={routeFormSelectTexts.locationSearchPlaceholder}
            emptyMessage={routeFormSelectTexts.locationEmptyMessage}
          />
        </FormField>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Водій">
          <SearchableSelect
            options={createDriverSearchableSelectOptions(driverLookupOptions)}
            selectedValue={routeFormValues.driverId}
            onSelectedValueChange={(driverId) =>
              updateRouteAssignmentFormValues({ driverId })
            }
            placeholder={routeFormSelectTexts.driverPlaceholder}
            searchPlaceholder={routeFormSelectTexts.driverSearchPlaceholder}
            emptyMessage={routeFormSelectTexts.driverEmptyMessage}
          />
        </FormField>
        <FormField label="Автомобіль">
          <SearchableSelect
            options={createAutoSearchableSelectOptions(
              autoLookupOptions,
              alwaysSelectableAutoId
            )}
            selectedValue={routeFormValues.autoId}
            onSelectedValueChange={(autoId) =>
              updateRouteAssignmentFormValues({ autoId })
            }
            placeholder={routeFormSelectTexts.autoPlaceholder}
            searchPlaceholder={routeFormSelectTexts.autoSearchPlaceholder}
            emptyMessage={routeFormSelectTexts.autoEmptyMessage}
          />
        </FormField>
      </div>
    </>
  )
}
