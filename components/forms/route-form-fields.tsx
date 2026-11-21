import { useTranslations } from "next-intl"
import { FormField } from "@/components/ui/form-field"
import { FormSection } from "@/components/forms/form-section"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { RouteCityPicker } from "@/components/forms/route-city-picker"
import {
  createAutoSearchableSelectOptions,
  createDriverSearchableSelectOptions,
} from "@/lib/forms/searchable-select-options"
import { cityGeocodingAttributionLinks } from "@/lib/constants"
import {
  AutoLookupOption,
  DriverLookupOption,
  FormFieldErrorMessages,
  RouteAssignmentFormValues,
} from "@/lib/types"

function renderAttributionLink(href: string) {
  return function AttributionLink(linkText: React.ReactNode) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-slate-600"
      >
        {linkText}
      </a>
    )
  }
}

interface RouteFormFieldsProps<
  TRouteFormValues extends RouteAssignmentFormValues,
> {
  routeFormValues: TRouteFormValues
  formFieldErrorMessages: FormFieldErrorMessages<string>
  onRouteFormValuesChange: (routeFormValues: TRouteFormValues) => void
  autoLookupOptions: ReadonlyArray<AutoLookupOption>
  driverLookupOptions: ReadonlyArray<DriverLookupOption>
  alwaysSelectableAutoId: number | null
}

export function RouteFormFields<
  TRouteFormValues extends RouteAssignmentFormValues,
>({
  routeFormValues,
  formFieldErrorMessages,
  onRouteFormValuesChange,
  autoLookupOptions,
  driverLookupOptions,
  alwaysSelectableAutoId,
}: RouteFormFieldsProps<TRouteFormValues>) {
  const autoStatusTranslations = useTranslations("autoStatus")
  const routeTranslations = useTranslations("routes")
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
      <FormSection title={routeTranslations("routeSectionTitle")}>
        <RouteCityPicker
          label={routeTranslations("startLocationLabel")}
          placeholder={routeTranslations("citySearchPlaceholder")}
          selectedCity={routeFormValues.startCity}
          errorMessage={formFieldErrorMessages.startCity}
          onSelectedCityChange={(startCity) =>
            updateRouteAssignmentFormValues({ startCity })
          }
        />
        <RouteCityPicker
          label={routeTranslations("destinationLocationLabel")}
          placeholder={routeTranslations("citySearchPlaceholder")}
          selectedCity={routeFormValues.destinationCity}
          errorMessage={formFieldErrorMessages.destinationCity}
          onSelectedCityChange={(destinationCity) =>
            updateRouteAssignmentFormValues({ destinationCity })
          }
        />
        <p className="text-xs text-slate-400 sm:col-span-2">
          {routeTranslations.rich("citySearchAttribution", {
            openMeteo: renderAttributionLink(
              cityGeocodingAttributionLinks.openMeteo
            ),
            geoNames: renderAttributionLink(
              cityGeocodingAttributionLinks.geoNames
            ),
            license: renderAttributionLink(
              cityGeocodingAttributionLinks.license
            ),
          })}
        </p>
      </FormSection>

      <FormSection title={routeTranslations("assignmentSectionTitle")}>
        <FormField
          label={routeTranslations("driverLabel")}
          isRequired
          errorMessage={formFieldErrorMessages.driverId}
        >
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
        <FormField
          label={routeTranslations("autoLabel")}
          isRequired
          errorMessage={formFieldErrorMessages.autoId}
        >
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
      </FormSection>
    </>
  )
}
