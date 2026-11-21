import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { FormFieldErrorMessages, RouteScheduleFormValues } from "@/lib/types"

interface RouteTimeFieldsProps<
  TRouteFormValues extends RouteScheduleFormValues,
> {
  routeFormValues: TRouteFormValues
  formFieldErrorMessages: FormFieldErrorMessages<string>
  onRouteFormValuesChange: (routeFormValues: TRouteFormValues) => void
}

export function RouteTimeFields<
  TRouteFormValues extends RouteScheduleFormValues,
>({
  routeFormValues,
  formFieldErrorMessages,
  onRouteFormValuesChange,
}: RouteTimeFieldsProps<TRouteFormValues>) {
  const routeTranslations = useTranslations("routes")

  const createRouteTimeLabel = (
    routeTimeLabel: string,
    locationTimeZoneId: string | null
  ): string =>
    locationTimeZoneId === null
      ? routeTranslations("timeLabelWithoutLocation", {
          timeLabel: routeTimeLabel,
        })
      : routeTranslations("timeLabelWithTimeZone", {
          timeLabel: routeTimeLabel,
          timeZoneId: locationTimeZoneId,
        })

  return (
    <>
      <FormField
        label={createRouteTimeLabel(
          routeTranslations("departureTimeLabel"),
          routeFormValues.startCity?.timeZoneId ?? null
        )}
        isRequired
        errorMessage={formFieldErrorMessages.departureLocalDateTime}
      >
        <Input
          type="datetime-local"
          value={routeFormValues.departureLocalDateTime}
          onChange={(event) =>
            onRouteFormValuesChange({
              ...routeFormValues,
              departureLocalDateTime: event.target.value,
            })
          }
        />
      </FormField>
      <FormField
        label={createRouteTimeLabel(
          routeTranslations("arrivalTimeLabel"),
          routeFormValues.destinationCity?.timeZoneId ?? null
        )}
        isRequired
        errorMessage={formFieldErrorMessages.arrivalLocalDateTime}
      >
        <Input
          type="datetime-local"
          value={routeFormValues.arrivalLocalDateTime}
          onChange={(event) =>
            onRouteFormValuesChange({
              ...routeFormValues,
              arrivalLocalDateTime: event.target.value,
            })
          }
        />
      </FormField>
    </>
  )
}
