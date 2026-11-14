import {
  defaultListPageSize,
  firstListPage,
  listPageSizeOptions,
  listSearchParamNames,
} from "@/lib/constants"
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

function getSanitizedListFilterValue(
  listFilterField: ListFilterField,
  rawFilterValue: string
): string {
  const trimmedFilterValue = rawFilterValue.trim()
  switch (listFilterField.kind) {
    case ListFilterFieldKind.Text:
      return trimmedFilterValue
    case ListFilterFieldKind.Date:
      return isoDateOnlyPattern.test(trimmedFilterValue)
        ? trimmedFilterValue
        : ""
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

export function hasActiveListFilters<TSortField extends string>(
  listPageState: ListPageState<TSortField>
): boolean {
  return (
    listPageState.listQuery.search !== "" ||
    Object.values(listPageState.filterValues).some(
      (filterValue) => filterValue !== ""
    )
  )
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
    listPageSizeOptions.includes(requestedPageSize)

  return {
    page:
      parsePositiveIntegerSearchParamValue(
        getPageSearchParamValue(pageSearchParams, listSearchParamNames.page)
      ) ?? firstListPage,
    pageSize: isRequestedPageSizeOffered
      ? requestedPageSize
      : defaultListPageSize,
    sort: findEnumValue(
      sortFieldEnum,
      getPageSearchParamValue(pageSearchParams, listSearchParamNames.sort)
    ),
    sortDirection: findEnumValue(
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
  if (isDefaultValueIncluded || listQuery.page !== firstListPage) {
    searchParams.set(listSearchParamNames.page, String(listQuery.page))
  }
  if (isDefaultValueIncluded || listQuery.pageSize !== defaultListPageSize) {
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
    page: firstListPage,
  }
}

export function getListPagesCount(
  totalCount: number,
  pageSize: number
): number {
  return Math.max(firstListPage, Math.ceil(totalCount / pageSize))
}
