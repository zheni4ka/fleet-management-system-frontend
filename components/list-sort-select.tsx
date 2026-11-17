"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { NativeSelect } from "@/components/ui/native-select"
import { listPaging } from "@/lib/constants"
import { createListPageHref } from "@/lib/search-params"
import { ListPageState, SortDirection, SortOption } from "@/lib/types"
import { findEnumValue, parseEnumValue } from "@/lib/utils"

interface ListSortSelectProps<TSortField extends string> {
  listPageState: ListPageState<TSortField>
  sortOptions: ReadonlyArray<SortOption<TSortField>>
  sortFieldEnum: Record<string, TSortField>
}

export function ListSortSelect<TSortField extends string>({
  listPageState,
  sortOptions,
  sortFieldEnum,
}: ListSortSelectProps<TSortField>) {
  const sortDirectionTranslations = useTranslations("sortDirection")
  const listControlTranslations = useTranslations("listControls")
  const tableColumnsTranslations = useTranslations("tableColumns")
  const router = useRouter()
  const { sort: selectedSortField, sortDirection: selectedSortDirection } =
    listPageState.listQuery

  const pushSort = (
    sortField: TSortField | null,
    sortDirection: SortDirection | null
  ) => {
    router.push(
      createListPageHref(listPageState, {
        sort: sortField,
        sortDirection: sortField === null ? null : sortDirection,
        page: listPaging.firstPage,
      })
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      {listControlTranslations("sortLabel")}
      <NativeSelect
        value={selectedSortField ?? ""}
        onChange={(event) =>
          pushSort(
            findEnumValue(sortFieldEnum, event.target.value),
            selectedSortDirection ?? SortDirection.Ascending
          )
        }
        className="w-48"
      >
        <option value="">
          {listControlTranslations("defaultSortOptionLabel")}
        </option>
        {sortOptions.map((sortOption) => (
          <option key={sortOption.sortField} value={sortOption.sortField}>
            {tableColumnsTranslations(sortOption.labelMessageKey)}
          </option>
        ))}
      </NativeSelect>
      <NativeSelect
        value={selectedSortDirection ?? SortDirection.Ascending}
        disabled={selectedSortField === null}
        onChange={(event) =>
          pushSort(
            selectedSortField,
            parseEnumValue(SortDirection, event.target.value)
          )
        }
        className="w-40"
      >
        {Object.values(SortDirection).map((sortDirection) => (
          <option key={sortDirection} value={sortDirection}>
            {sortDirectionTranslations(sortDirection)}
          </option>
        ))}
      </NativeSelect>
    </div>
  )
}
