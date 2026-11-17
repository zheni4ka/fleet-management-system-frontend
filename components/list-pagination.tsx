import type { ReactNode } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ListPageSizeSelect } from "@/components/list-page-size-select"
import { useTranslations } from "next-intl"
import { listPaging } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { createListPageHref, getListPagesCount } from "@/lib/search-params"
import { ListPageState } from "@/lib/types"

const visibleNeighbourPagesCount = 2

const paginationControlClassName =
  "inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md border bg-white px-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"

const disabledPaginationControlClassName =
  "inline-flex h-8 min-w-8 cursor-not-allowed items-center justify-center rounded-md border bg-slate-50 px-2 text-sm text-slate-300"

interface ListPaginationProps<TSortField extends string> {
  listPageState: ListPageState<TSortField>
  totalCount: number
}

export function ListPagination<TSortField extends string>({
  listPageState,
  totalCount,
}: ListPaginationProps<TSortField>) {
  const paginationTranslations = useTranslations("pagination")
  const { page, pageSize } = listPageState.listQuery
  const pagesCount = getListPagesCount(totalCount, pageSize)
  const isPageWithShownItems = totalCount > 0 && page <= pagesCount
  const firstShownItemNumber = isPageWithShownItems
    ? (page - 1) * pageSize + 1
    : 0
  const lastShownItemNumber = isPageWithShownItems
    ? Math.min(page * pageSize, totalCount)
    : 0
  const nearestExistingPage = Math.min(page, pagesCount)
  const previousPage = page > pagesCount ? pagesCount : page - 1

  const firstVisiblePage = Math.max(
    listPaging.firstPage,
    nearestExistingPage - visibleNeighbourPagesCount
  )
  const lastVisiblePage = Math.min(
    pagesCount,
    nearestExistingPage + visibleNeighbourPagesCount
  )
  const visiblePages = Array.from(
    { length: Math.max(0, lastVisiblePage - firstVisiblePage + 1) },
    (_, visiblePageOffset) => firstVisiblePage + visiblePageOffset
  )

  const renderPageStepControl = (
    targetPage: number,
    isTargetPageAvailable: boolean,
    controlLabel: string,
    controlIcon: ReactNode
  ) =>
    isTargetPageAvailable ? (
      <Link
        href={createListPageHref(listPageState, { page: targetPage })}
        aria-label={controlLabel}
        className={paginationControlClassName}
      >
        {controlIcon}
      </Link>
    ) : (
      <span
        aria-label={controlLabel}
        aria-disabled="true"
        className={disabledPaginationControlClassName}
      >
        {controlIcon}
      </span>
    )

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-500">
        {paginationTranslations("shownRange", {
          firstShownItemNumber,
          lastShownItemNumber,
          totalCount,
        })}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <ListPageSizeSelect listPageState={listPageState} />
        <nav
          aria-label={paginationTranslations("pages")}
          className="flex items-center gap-1"
        >
          {renderPageStepControl(
            previousPage,
            page > listPaging.firstPage,
            paginationTranslations("previousPage"),
            <ChevronLeft className="h-4 w-4" />
          )}
          {visiblePages.map((visiblePage) => (
            <Link
              key={visiblePage}
              href={createListPageHref(listPageState, { page: visiblePage })}
              aria-current={visiblePage === page ? "page" : undefined}
              className={cn(
                paginationControlClassName,
                visiblePage === page &&
                  "border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
              )}
            >
              {visiblePage}
            </Link>
          ))}
          {renderPageStepControl(
            page + 1,
            page < pagesCount,
            paginationTranslations("nextPage"),
            <ChevronRight className="h-4 w-4" />
          )}
        </nav>
      </div>
    </div>
  )
}
