import { ListFilterFieldKind } from "./list-filter-field-kind"

export interface DateListFilterField {
  kind: ListFilterFieldKind.Date
  name: string
  label: string
  rangeStartFieldName?: string
}
