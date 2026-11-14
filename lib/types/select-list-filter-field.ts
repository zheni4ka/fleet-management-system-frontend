import { ListFilterFieldKind } from "./list-filter-field-kind"
import { ListFilterOption } from "./list-filter-option"

export interface SelectListFilterField {
  kind: ListFilterFieldKind.Select
  name: string
  label: string
  allOptionsLabel: string
  options: ReadonlyArray<ListFilterOption>
}
