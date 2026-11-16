"use client"

import { useRouter } from "next/navigation"
import { NativeSelect } from "@/components/ui/native-select"
import { listPaging } from "@/lib/constants"
import { createListPageHref } from "@/lib/search-params"
import { ListPageState } from "@/lib/types"

interface ListPageSizeSelectProps<TSortField extends string> {
  listPageState: ListPageState<TSortField>
}

export function ListPageSizeSelect<TSortField extends string>({
  listPageState,
}: ListPageSizeSelectProps<TSortField>) {
  const router = useRouter()

  return (
    <label className="flex items-center gap-2 text-sm text-slate-500">
      На сторінці
      <NativeSelect
        value={listPageState.listQuery.pageSize}
        onChange={(event) =>
          router.push(
            createListPageHref(listPageState, {
              pageSize: Number(event.target.value),
              page: listPaging.firstPage,
            })
          )
        }
        className="w-20"
      >
        {listPaging.pageSizeOptions.map((listPageSizeOption) => (
          <option key={listPageSizeOption} value={listPageSizeOption}>
            {listPageSizeOption}
          </option>
        ))}
      </NativeSelect>
    </label>
  )
}
