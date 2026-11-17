import { useTranslations } from "next-intl"
import { Depot } from "@/lib/types"

interface DepotCheckboxListProps {
  depots: ReadonlyArray<Depot>
  selectedDepotIds: ReadonlyArray<number>
  onSelectedDepotIdsChange: (selectedDepotIds: ReadonlyArray<number>) => void
}

export function DepotCheckboxList({
  depots,
  selectedDepotIds,
  onSelectedDepotIdsChange,
}: DepotCheckboxListProps) {
  const listFilterTranslations = useTranslations("listFilters")
  const toggleDepotSelection = (toggledDepotId: number) => {
    onSelectedDepotIdsChange(
      selectedDepotIds.includes(toggledDepotId)
        ? selectedDepotIds.filter(
            (selectedDepotId) => selectedDepotId !== toggledDepotId
          )
        : [...selectedDepotIds, toggledDepotId]
    )
  }

  return (
    <fieldset className="flex flex-col gap-2 text-sm text-slate-700">
      <legend className="mb-1 font-medium">
        {listFilterTranslations("depotLabel")}
      </legend>
      {depots.map((depot) => (
        <label
          key={depot.id}
          className="flex cursor-pointer items-center gap-2"
        >
          <input
            type="checkbox"
            className="size-4 cursor-pointer"
            checked={selectedDepotIds.includes(depot.id)}
            onChange={() => toggleDepotSelection(depot.id)}
          />
          {depot.name}
        </label>
      ))}
    </fieldset>
  )
}
