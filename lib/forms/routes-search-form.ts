import { getPageSearchParamValue } from "@/lib/search-params"
import { PageSearchParams, RoutesSearchFormValues } from "@/lib/types"

export function createEmptyRoutesSearchFormValues(): RoutesSearchFormValues {
  return {
    startCity: "",
    destinationCity: "",
    departureFromDate: "",
    departureToDate: "",
    status: "",
    driverId: "",
    autoId: "",
  }
}

export function createRoutesSearchFormValuesFromPageSearchParams(
  pageSearchParams: PageSearchParams
): RoutesSearchFormValues {
  return {
    startCity: getPageSearchParamValue(pageSearchParams, "startCity"),
    destinationCity: getPageSearchParamValue(
      pageSearchParams,
      "destinationCity"
    ),
    departureFromDate: getPageSearchParamValue(
      pageSearchParams,
      "departureFromDate"
    ),
    departureToDate: getPageSearchParamValue(
      pageSearchParams,
      "departureToDate"
    ),
    status: getPageSearchParamValue(pageSearchParams, "status"),
    driverId: getPageSearchParamValue(pageSearchParams, "driverId"),
    autoId: getPageSearchParamValue(pageSearchParams, "autoId"),
  }
}
