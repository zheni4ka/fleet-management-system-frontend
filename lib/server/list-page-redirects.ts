import { redirect } from "next/navigation"
import {
  createListPageHref,
  getListPagesCount,
  isPageSearchParamsMatchingHref,
} from "@/lib/search-params"
import { ListPageState, PageSearchParams } from "@/lib/types"

export function redirectToCanonicalListPageHref<TSortField extends string>(
  listPageState: ListPageState<TSortField>,
  pageSearchParams: PageSearchParams
): void {
  const canonicalListPageHref = createListPageHref(listPageState, {})
  if (
    !isPageSearchParamsMatchingHref(pageSearchParams, canonicalListPageHref)
  ) {
    redirect(canonicalListPageHref)
  }
}

export function redirectToLastListPageWhenPageOutOfRange<
  TSortField extends string,
>(listPageState: ListPageState<TSortField>, totalCount: number): void {
  const listPagesCount = getListPagesCount(
    totalCount,
    listPageState.listQuery.pageSize
  )
  if (listPageState.listQuery.page > listPagesCount) {
    redirect(createListPageHref(listPageState, { page: listPagesCount }))
  }
}
