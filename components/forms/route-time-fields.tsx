import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { RouteScheduleFormValues } from "@/lib/types"

interface RouteTimeFieldsProps<
  TRouteFormValues extends RouteScheduleFormValues,
> {
  routeFormValues: TRouteFormValues
  onRouteFormValuesChange: (routeFormValues: TRouteFormValues) => void
}

export function RouteTimeFields<
  TRouteFormValues extends RouteScheduleFormValues,
>({
  routeFormValues,
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
    <div className="grid gap-3 sm:grid-cols-2">
      <FormField
        label={createRouteTimeLabel(
          routeTranslations("departureTimeLabel"),
          routeFormValues.startCity?.timeZoneId ?? null
        )}
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
    </div>
  )
}
