import { ListQuery } from "./list-query"
import { SearchFormValues } from "./search-form-values"

export interface ListPageState<TSortField extends string> {
  path: string
  listQuery: ListQuery<TSortField>
  filterValues: SearchFormValues
}
