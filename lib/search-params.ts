import { listPaging, listSearchParamNames } from "@/lib/constants"
import {
  ListFilterField,
  ListFilterFieldKind,
  ListPageState,
  ListQuery,
  PageSearchParams,
  SearchFormValues,
  SortDirection,
} from "@/lib/types"
import { findEnumValue } from "@/lib/utils"

const isoDateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/

export function isIsoDateOnlyText(dateText: string): boolean {
  if (!isoDateOnlyPattern.test(dateText)) {
    return false
  }
  const [yearNumber, monthNumber, dayNumber] = dateText.split("-").map(Number)
  const calendarDate = new Date(
    Date.UTC(yearNumber, monthNumber - 1, dayNumber)
  )
  return (
    calendarDate.getUTCFullYear() === yearNumber &&
    calendarDate.getUTCMonth() === monthNumber - 1 &&
    calendarDate.getUTCDate() === dayNumber
  )
}

function getSanitizedListFilterValue(
  listFilterField: ListFilterField,
  rawFilterValue: string
): string {
  const trimmedFilterValue = rawFilterValue.trim()
  switch (listFilterField.kind) {
    case ListFilterFieldKind.Text:
      return trimmedFilterValue
    case ListFilterFieldKind.Date:
      return isIsoDateOnlyText(trimmedFilterValue) ? trimmedFilterValue : ""
    case ListFilterFieldKind.Select:
      return listFilterField.options.some(
        (listFilterOption) => listFilterOption.value === trimmedFilterValue
      )
        ? trimmedFilterValue
        : ""
  }
}

export function getListFilterValuesFromPageSearchParams(
  pageSearchParams: PageSearchParams,
  listFilterFields: ReadonlyArray<ListFilterField>
): SearchFormValues {
  return Object.fromEntries(
    listFilterFields
      .filter(
        (listFilterField) =>
          listFilterField.name !== listSearchParamNames.search
      )
      .map((listFilterField) => [
        listFilterField.name,
        getSanitizedListFilterValue(
          listFilterField,
          getPageSearchParamValue(pageSearchParams, listFilterField.name)
        ),
      ])
  )
}

export function getActiveListFiltersCount<TSortField extends string>(
  listPageState: ListPageState<TSortField>
): number {
  const activeFilterValuesCount = Object.values(
    listPageState.filterValues
  ).filter((filterValue) => filterValue !== "").length
  return listPageState.listQuery.search === ""
    ? activeFilterValuesCount
    : activeFilterValuesCount + 1
}

export function hasActiveListFilters<TSortField extends string>(
  listPageState: ListPageState<TSortField>
): boolean {
  return getActiveListFiltersCount(listPageState) > 0
}

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

function parsePositiveIntegerSearchParamValue(
  searchParamValue: string
): number | null {
  const parsedNumber = Number(searchParamValue)
  return Number.isInteger(parsedNumber) && parsedNumber > 0
    ? parsedNumber
    : null
}

export function getListQueryFromPageSearchParams<TSortField extends string>(
  pageSearchParams: PageSearchParams,
  sortFieldEnum: Record<string, TSortField>
): ListQuery<TSortField> {
  const requestedPageSize = parsePositiveIntegerSearchParamValue(
    getPageSearchParamValue(pageSearchParams, listSearchParamNames.pageSize)
  )
  const isRequestedPageSizeOffered =
    requestedPageSize !== null &&
    listPaging.pageSizeOptions.includes(requestedPageSize)

  const requestedSortField = findEnumValue(
    sortFieldEnum,
    getPageSearchParamValue(pageSearchParams, listSearchParamNames.sort)
  )

  return {
    page:
      parsePositiveIntegerSearchParamValue(
        getPageSearchParamValue(pageSearchParams, listSearchParamNames.page)
      ) ?? listPaging.firstPage,
    pageSize: isRequestedPageSizeOffered
      ? requestedPageSize
      : listPaging.defaultPageSize,
    sort: requestedSortField,
    sortDirection:
      requestedSortField === null
        ? null
        : findEnumValue(
            SortDirection,
            getPageSearchParamValue(
              pageSearchParams,
              listSearchParamNames.sortDirection
            )
          ),
    search: getPageSearchParamValue(
      pageSearchParams,
      listSearchParamNames.search
    ).trim(),
  }
}

function appendListQuerySearchParams<TSortField extends string>(
  searchParams: URLSearchParams,
  listQuery: ListQuery<TSortField>,
  isDefaultValueIncluded: boolean
): URLSearchParams {
  if (isDefaultValueIncluded || listQuery.page !== listPaging.firstPage) {
    searchParams.set(listSearchParamNames.page, String(listQuery.page))
  }
  if (
    isDefaultValueIncluded ||
    listQuery.pageSize !== listPaging.defaultPageSize
  ) {
    searchParams.set(listSearchParamNames.pageSize, String(listQuery.pageSize))
  }
  if (listQuery.sort !== null) {
    searchParams.set(listSearchParamNames.sort, listQuery.sort)
  }
  if (listQuery.sortDirection !== null) {
    searchParams.set(
      listSearchParamNames.sortDirection,
      listQuery.sortDirection
    )
  }
  if (listQuery.search !== "") {
    searchParams.set(listSearchParamNames.search, listQuery.search)
  }
  return searchParams
}

export function createListApiPath<TSortField extends string>(
  apiPath: string,
  listQuery: ListQuery<TSortField>,
  filterValues: SearchFormValues = {}
): string {
  return createPathWithSearchParams(
    apiPath,
    appendListQuerySearchParams(
      createSearchParamsFromFormValues(filterValues),
      listQuery,
      true
    )
  )
}

export function createListPageHref<TSortField extends string>(
  listPageState: ListPageState<TSortField>,
  listQueryChanges: Partial<ListQuery<TSortField>>,
  filterValues: SearchFormValues = listPageState.filterValues
): string {
  return createPathWithSearchParams(
    listPageState.path,
    appendListQuerySearchParams(
      createSearchParamsFromFormValues(filterValues),
      { ...listPageState.listQuery, ...listQueryChanges },
      false
    )
  )
}

export function getSortedListQueryChanges<TSortField extends string>(
  listQuery: ListQuery<TSortField>,
  sortField: TSortField
): Partial<ListQuery<TSortField>> {
  const isSortedAscendingBySameField =
    listQuery.sort === sortField &&
    listQuery.sortDirection !== SortDirection.Descending
  return {
    sort: sortField,
    sortDirection: isSortedAscendingBySameField
      ? SortDirection.Descending
      : SortDirection.Ascending,
    page: listPaging.firstPage,
  }
}

function createSortedSearchParamsText(searchParams: URLSearchParams): string {
  searchParams.sort()
  return searchParams.toString()
}

export function isPageSearchParamsMatchingHref(
  pageSearchParams: PageSearchParams,
  href: string
): boolean {
  const pageSearchParamsList = new URLSearchParams()
  for (const [searchParamName, searchParamValue] of Object.entries(
    pageSearchParams
  )) {
    const searchParamValues =
      searchParamValue === undefined
        ? []
        : Array.isArray(searchParamValue)
          ? searchParamValue
          : [searchParamValue]
    for (const singleSearchParamValue of searchParamValues) {
      pageSearchParamsList.append(searchParamName, singleSearchParamValue)
    }
  }
  const [, hrefSearchParamsText = ""] = href.split("?")
  return (
    createSortedSearchParamsText(pageSearchParamsList) ===
    createSortedSearchParamsText(new URLSearchParams(hrefSearchParamsText))
  )
}

export function getListPagesCount(
  totalCount: number,
  pageSize: number
): number {
  return Math.max(listPaging.firstPage, Math.ceil(totalCount / pageSize))
}
