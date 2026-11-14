import { SortDirection } from "./sort-direction"

export interface ListQuery<TSortField extends string> {
  page: number
  pageSize: number
  sort: TSortField | null
  sortDirection: SortDirection | null
  search: string
}
