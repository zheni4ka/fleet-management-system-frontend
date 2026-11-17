import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  createListPageHref,
  getSortedListQueryChanges,
} from "@/lib/search-params"
import { ListPageState, SortDirection, TableColumn } from "@/lib/types"

interface TableColumnsHeaderProps<TSortField extends string> {
  tableColumns: ReadonlyArray<TableColumn<TSortField>>
  listPageState?: ListPageState<TSortField>
}

export function TableColumnsHeader<TSortField extends string>({
  tableColumns,
  listPageState,
}: TableColumnsHeaderProps<TSortField>) {
  const tableColumnsTranslations = useTranslations("tableColumns")
  const renderSortDirectionIcon = (sortField: TSortField) => {
    if (listPageState?.listQuery.sort !== sortField) {
      return (
        <ArrowUpDown
          aria-hidden="true"
          className="h-3.5 w-3.5 text-slate-500"
        />
      )
    }
    return listPageState.listQuery.sortDirection ===
      SortDirection.Descending ? (
      <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
    ) : (
      <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
    )
  }

  return (
    <TableHeader>
      <TableRow>
        {tableColumns.map((tableColumn) => (
          <TableHead
            key={tableColumn.labelMessageKey}
            className={tableColumn.className}
          >
            {tableColumn.sortField === undefined ||
            listPageState === undefined ? (
              tableColumnsTranslations(tableColumn.labelMessageKey)
            ) : (
              <Link
                href={createListPageHref(
                  listPageState,
                  getSortedListQueryChanges(
                    listPageState.listQuery,
                    tableColumn.sortField
                  )
                )}
                scroll={false}
                className="inline-flex cursor-pointer items-center gap-1 rounded-sm hover:text-slate-900"
              >
                {tableColumnsTranslations(tableColumn.labelMessageKey)}
                {renderSortDirectionIcon(tableColumn.sortField)}
              </Link>
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  )
}
