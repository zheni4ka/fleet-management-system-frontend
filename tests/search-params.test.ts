import { describe, expect, it } from "vitest"
import { listPaging } from "@/lib/constants"
import {
  createListApiPath,
  createListPageHref,
  getListFilterValuesFromPageSearchParams,
  getListPagesCount,
  getListQueryFromPageSearchParams,
  getSortedListQueryChanges,
} from "@/lib/search-params"
import {
  ListFilterField,
  ListFilterFieldKind,
  ListPageState,
  RouteSortField,
  SortDirection,
} from "@/lib/types"

const routeListFilterFields: ReadonlyArray<ListFilterField> = [
  {
    kind: ListFilterFieldKind.Text,
    name: "startCity",
    label: "",
    placeholder: "",
  },
  { kind: ListFilterFieldKind.Date, name: "departureFromDate", label: "" },
  {
    kind: ListFilterFieldKind.Select,
    name: "depotId",
    label: "",
    allOptionsLabel: "",
    options: [{ value: "1", label: "Основне депо" }],
  },
]

describe("getListQueryFromPageSearchParams", () => {
  it("falls back to the first page and default page size for invalid paging values", () => {
    const listQuery = getListQueryFromPageSearchParams(
      { page: "-3", pageSize: "7", sort: "Unknown", search: "  Kyiv  " },
      RouteSortField
    )

    expect(listQuery).toEqual({
      page: listPaging.firstPage,
      pageSize: listPaging.defaultPageSize,
      sort: null,
      sortDirection: null,
      search: "Kyiv",
    })
  })

  it("keeps an offered page size and a known sort field", () => {
    const listQuery = getListQueryFromPageSearchParams(
      {
        page: "2",
        pageSize: "50",
        sort: RouteSortField.Status,
        sortDirection: SortDirection.Descending,
      },
      RouteSortField
    )

    expect(listQuery).toMatchObject({
      page: 2,
      pageSize: 50,
      sort: RouteSortField.Status,
      sortDirection: SortDirection.Descending,
    })
  })
})

describe("getListFilterValuesFromPageSearchParams", () => {
  it("drops malformed dates and select values that are not offered", () => {
    const filterValues = getListFilterValuesFromPageSearchParams(
      { startCity: " Lviv ", departureFromDate: "26.11.2026", depotId: "99" },
      routeListFilterFields
    )

    expect(filterValues).toEqual({
      startCity: "Lviv",
      departureFromDate: "",
      depotId: "",
    })
  })
})

describe("list paths", () => {
  const routeListPageState: ListPageState<RouteSortField> = {
    path: "/route",
    listQuery: {
      page: listPaging.firstPage,
      pageSize: listPaging.defaultPageSize,
      sort: null,
      sortDirection: null,
      search: "",
    },
    filterValues: { startCity: "Lviv", depotId: "" },
  }

  it("always sends paging to the API but omits empty filters", () => {
    expect(
      createListApiPath(
        "/api/v1/Route/getRoutesPagedList",
        routeListPageState.listQuery,
        routeListPageState.filterValues
      )
    ).toBe("/api/v1/Route/getRoutesPagedList?startCity=Lviv&page=1&pageSize=20")
  })

  it("omits default paging from page links", () => {
    expect(createListPageHref(routeListPageState, { page: 3 })).toBe(
      "/route?startCity=Lviv&page=3"
    )
  })
})

describe("getSortedListQueryChanges", () => {
  it("toggles to descending when the same field is sorted ascending and resets the page", () => {
    expect(
      getSortedListQueryChanges(
        {
          page: 4,
          pageSize: 20,
          sort: RouteSortField.Status,
          sortDirection: SortDirection.Ascending,
          search: "",
        },
        RouteSortField.Status
      )
    ).toEqual({
      sort: RouteSortField.Status,
      sortDirection: SortDirection.Descending,
      page: listPaging.firstPage,
    })
  })
})

describe("getListPagesCount", () => {
  it("returns at least one page", () => {
    expect(getListPagesCount(0, 20)).toBe(1)
    expect(getListPagesCount(41, 20)).toBe(3)
  })
})
