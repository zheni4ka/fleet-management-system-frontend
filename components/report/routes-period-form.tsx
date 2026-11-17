"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { appRoutes } from "@/lib/constants"
import {
  createCurrentMonthRoutesPeriodFormValues,
  createLastWeekRoutesPeriodFormValues,
  createTodayRoutesPeriodFormValues,
  getRoutesPeriodFormValidationError,
} from "@/lib/forms/routes-period-form"
import {
  createPathWithSearchParams,
  createSearchParamsFromFormValues,
} from "@/lib/search-params"
import { RoutesPeriodFormValues } from "@/lib/types"

interface RoutesPeriodFormProps {
  initialRoutesPeriodFormValues: RoutesPeriodFormValues
}

const routesPeriodPresets = [
  {
    labelMessageKey: "todayPreset",
    createFormValues: createTodayRoutesPeriodFormValues,
  },
  {
    labelMessageKey: "lastWeekPreset",
    createFormValues: createLastWeekRoutesPeriodFormValues,
  },
  {
    labelMessageKey: "currentMonthPreset",
    createFormValues: createCurrentMonthRoutesPeriodFormValues,
  },
]

export function RoutesPeriodForm({
  initialRoutesPeriodFormValues,
}: RoutesPeriodFormProps) {
  const router = useRouter()
  const reportTranslations = useTranslations("reports")
  const formValidationTranslations = useTranslations("formValidation")
  const [routesPeriodFormValues, setRoutesPeriodFormValues] = useState(
    initialRoutesPeriodFormValues
  )

  const updateRoutesPeriodFormValues = (
    changedValues: Partial<RoutesPeriodFormValues>
  ) => {
    setRoutesPeriodFormValues({ ...routesPeriodFormValues, ...changedValues })
  }

  const showRoutesPeriodReport = (
    requestedRoutesPeriodFormValues: RoutesPeriodFormValues
  ) => {
    const routesPeriodFormValidationError = getRoutesPeriodFormValidationError(
      requestedRoutesPeriodFormValues
    )
    if (routesPeriodFormValidationError !== null) {
      toast.error(formValidationTranslations(routesPeriodFormValidationError))
      return
    }
    router.push(
      createPathWithSearchParams(
        appRoutes.reports,
        createSearchParamsFromFormValues(requestedRoutesPeriodFormValues)
      )
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    showRoutesPeriodReport(routesPeriodFormValues)
  }

  const handlePresetClick = (presetFormValues: RoutesPeriodFormValues) => {
    setRoutesPeriodFormValues(presetFormValues)
    showRoutesPeriodReport(presetFormValues)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border bg-white p-4 shadow-sm print:hidden"
    >
      <div className="flex flex-wrap gap-2">
        {routesPeriodPresets.map((routesPeriodPreset) => (
          <Button
            key={routesPeriodPreset.labelMessageKey}
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              handlePresetClick(routesPeriodPreset.createFormValues())
            }
          >
            {reportTranslations(routesPeriodPreset.labelMessageKey)}
          </Button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <FormField label={reportTranslations("periodStartLabel")}>
          <Input
            type="date"
            value={routesPeriodFormValues.periodStartDate}
            onChange={(event) =>
              updateRoutesPeriodFormValues({
                periodStartDate: event.target.value,
              })
            }
          />
        </FormField>
        <FormField label={reportTranslations("periodEndLabel")}>
          <Input
            type="date"
            value={routesPeriodFormValues.periodEndDate}
            onChange={(event) =>
              updateRoutesPeriodFormValues({
                periodEndDate: event.target.value,
              })
            }
          />
        </FormField>
        <div className="flex items-end gap-2">
          <Button type="submit" className="flex-1">
            {reportTranslations("generateButtonLabel")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => window.print()}
          >
            {reportTranslations("printButtonLabel")}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default RoutesPeriodForm
