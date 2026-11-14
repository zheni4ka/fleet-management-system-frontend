import { PageSearchParams, SearchFormValues } from "@/lib/types"

export function getPageSearchParamValue(
  pageSearchParams: PageSearchParams,
  searchParamName: string
): string {
  const searchParamValue = pageSearchParams[searchParamName]
  if (Array.isArray(searchParamValue)) {
    return searchParamValue[0] ?? ""
  }
  return searchParamValue ?? ""
}

export function createSearchParamsFromFormValues(
  searchFormValues: SearchFormValues
): URLSearchParams {
  const searchParams = new URLSearchParams()
  for (const [searchParamName, searchParamValue] of Object.entries(
    searchFormValues
  )) {
    const trimmedSearchParamValue = searchParamValue.trim()
    if (trimmedSearchParamValue !== "") {
      searchParams.set(searchParamName, trimmedSearchParamValue)
    }
  }
  return searchParams
}

export function createPathWithSearchParams(
  path: string,
  searchParams: URLSearchParams
): string {
  const searchParamsText = searchParams.toString()
  return searchParamsText === "" ? path : `${path}?${searchParamsText}`
}
