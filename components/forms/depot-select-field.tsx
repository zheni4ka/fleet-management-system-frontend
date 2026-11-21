import { useTranslations } from "next-intl"
import { NativeSelect } from "@/components/ui/native-select"
import { FormField } from "@/components/ui/form-field"
import { Depot } from "@/lib/types"

interface DepotSelectFieldProps {
  depots: ReadonlyArray<Depot>
  selectedDepotId: string
  errorMessage?: string
  onSelectedDepotIdChange: (selectedDepotId: string) => void
}

export function DepotSelectField({
  depots,
  selectedDepotId,
  errorMessage,
  onSelectedDepotIdChange,
}: DepotSelectFieldProps) {
  const listFilterTranslations = useTranslations("listFilters")
  const depotTranslations = useTranslations("depots")
  return (
    <FormField
      label={listFilterTranslations("depotLabel")}
      isRequired
      errorMessage={errorMessage}
    >
      <NativeSelect
        value={selectedDepotId}
        onChange={(event) => onSelectedDepotIdChange(event.target.value)}
      >
        <option value="" disabled>
          {depotTranslations("selectPlaceholder")}
        </option>
        {depots.map((depot) => (
          <option key={depot.id} value={String(depot.id)}>
            {depot.name}
          </option>
        ))}
      </NativeSelect>
    </FormField>
  )
}
