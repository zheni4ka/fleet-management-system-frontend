import { formatLocalIsoDate } from "@/lib/formatters"
import { getPageSearchParamValue } from "@/lib/search-params"
import { PageSearchParams, RoutesPeriodFormValues } from "@/lib/types"

const lastWeekDaysCount = 7

export function createRoutesPeriodFormValuesFromPageSearchParams(
  pageSearchParams: PageSearchParams
): RoutesPeriodFormValues {
  return {
    periodStartDate: getPageSearchParamValue(
      pageSearchParams,
      "periodStartDate"
    ),
    periodEndDate: getPageSearchParamValue(pageSearchParams, "periodEndDate"),
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
): string | null {
  if (!getIsRoutesPeriodFormFilled(routesPeriodFormValues)) {
    return "Оберіть початкову та кінцеву дату періоду."
  }
  if (
    routesPeriodFormValues.periodEndDate <
    routesPeriodFormValues.periodStartDate
  ) {
    return "Кінець періоду не може бути раніше за його початок."
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
    todayDate.getDate() - (lastWeekDaysCount - 1)
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
