import { NativeSelect } from "@/components/ui/native-select"
import { FormField } from "@/components/ui/form-field"
import { listFilterTexts } from "@/lib/constants"
import { Depot } from "@/lib/types"

interface DepotSelectFieldProps {
  depots: ReadonlyArray<Depot>
  selectedDepotId: string
  onSelectedDepotIdChange: (selectedDepotId: string) => void
}

export function DepotSelectField({
  depots,
  selectedDepotId,
  onSelectedDepotIdChange,
}: DepotSelectFieldProps) {
  return (
    <FormField label={listFilterTexts.depotLabel}>
      <NativeSelect
        value={selectedDepotId}
        onChange={(event) => onSelectedDepotIdChange(event.target.value)}
      >
        <option value="" disabled>
          Оберіть депо
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
