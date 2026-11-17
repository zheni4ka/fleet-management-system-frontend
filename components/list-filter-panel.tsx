import { useTranslations } from "next-intl"
import { FloatingPanel } from "@/components/floating-panel"
import { ListFilterForm } from "@/components/list-filter-form"
import { browserStorageKeys } from "@/lib/constants"
import {
  createListPageHref,
  getActiveListFiltersCount,
} from "@/lib/search-params"
import { ListFilterField, ListPageState } from "@/lib/types"

interface ListFilterPanelProps<TSortField extends string> {
  title: string
  listPageState: ListPageState<TSortField>
  listFilterFields: ReadonlyArray<ListFilterField>
}

export function ListFilterPanel<TSortField extends string>({
  title,
  listPageState,
  listFilterFields,
}: ListFilterPanelProps<TSortField>) {
  const listControlTranslations = useTranslations("listControls")
  const activeListFiltersCount = getActiveListFiltersCount(listPageState)

  return (
    <FloatingPanel
      title={title}
      badgeText={
        activeListFiltersCount === 0
          ? null
          : listControlTranslations("activeFiltersCount", {
              activeFiltersCount: activeListFiltersCount,
            })
      }
      storageKey={browserStorageKeys.listFilterPanelState}
    >
      <ListFilterForm
        key={createListPageHref(listPageState, {})}
        listPageState={listPageState}
        listFilterFields={listFilterFields}
      />
    </FloatingPanel>
  )
}
