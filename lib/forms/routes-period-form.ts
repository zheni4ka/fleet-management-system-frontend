import {
  routesPeriodPresetSettings,
  routesPeriodSearchParamNames,
} from "@/lib/constants"
import { formatLocalIsoDate } from "@/lib/formatters"
import { getPageSearchParamValue } from "@/lib/search-params"
import {
  FormValidationError,
  PageSearchParams,
  RoutesPeriodFormValues,
} from "@/lib/types"

export function createRoutesPeriodFormValuesFromPageSearchParams(
  pageSearchParams: PageSearchParams
): RoutesPeriodFormValues {
  return {
    periodStartDate: getPageSearchParamValue(
      pageSearchParams,
      routesPeriodSearchParamNames.periodStartDate
    ),
    periodEndDate: getPageSearchParamValue(
      pageSearchParams,
      routesPeriodSearchParamNames.periodEndDate
    ),
  }
}

export function getIsRoutesPeriodFormFilled(
  routesPeriodFormValues: RoutesPeriodFormValues
): boolean {
  return (
    routesPeriodFormValues.periodStartDate !== "" &&
    routesPeriodFormValues.periodEndDate !== ""
  )
}

export function getRoutesPeriodFormValidationError(
  routesPeriodFormValues: RoutesPeriodFormValues
): FormValidationError | null {
  if (!getIsRoutesPeriodFormFilled(routesPeriodFormValues)) {
    return FormValidationError.RoutesPeriodDatesMissing
  }
  if (
    routesPeriodFormValues.periodEndDate <
    routesPeriodFormValues.periodStartDate
  ) {
    return FormValidationError.RoutesPeriodEndBeforeStart
  }
  return null
}

export function createTodayRoutesPeriodFormValues(): RoutesPeriodFormValues {
  const todayDateText = formatLocalIsoDate(new Date())
  return { periodStartDate: todayDateText, periodEndDate: todayDateText }
}

export function createLastWeekRoutesPeriodFormValues(): RoutesPeriodFormValues {
  const todayDate = new Date()
  const lastWeekStartDate = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate() - (routesPeriodPresetSettings.lastWeekDaysCount - 1)
  )
  return {
    periodStartDate: formatLocalIsoDate(lastWeekStartDate),
    periodEndDate: formatLocalIsoDate(todayDate),
  }
}

export function createCurrentMonthRoutesPeriodFormValues(): RoutesPeriodFormValues {
  const todayDate = new Date()
  const currentMonthStartDate = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    1
  )
  const currentMonthEndDate = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth() + 1,
    0
  )
  return {
    periodStartDate: formatLocalIsoDate(currentMonthStartDate),
    periodEndDate: formatLocalIsoDate(currentMonthEndDate),
  }
}
