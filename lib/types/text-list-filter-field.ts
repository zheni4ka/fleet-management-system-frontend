import { ListFilterFieldKind } from "./list-filter-field-kind"

export interface TextListFilterField {
  kind: ListFilterFieldKind.Text
  name: string
  label: string
  placeholder: string
}
