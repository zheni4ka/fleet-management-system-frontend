import { DateListFilterField } from "./date-list-filter-field"
import { SelectListFilterField } from "./select-list-filter-field"
import { TextListFilterField } from "./text-list-filter-field"

export type ListFilterField =
  | TextListFilterField
  | DateListFilterField
  | SelectListFilterField
