import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { FormField } from "@/components/ui/form-field"
import { autoColorOptions } from "@/lib/constants"
import { AutoFormValues } from "@/lib/types"

interface AutoFormFieldsProps {
  autoFormValues: AutoFormValues
  onAutoFormValuesChange: (autoFormValues: AutoFormValues) => void
}

export function AutoFormFields({
  autoFormValues,
  onAutoFormValuesChange,
}: AutoFormFieldsProps) {
  const updateAutoFormValues = (changedValues: Partial<AutoFormValues>) => {
    onAutoFormValuesChange({ ...autoFormValues, ...changedValues })
  }

  const isCurrentColorMissingFromOptions =
    autoFormValues.color !== "" &&
    !autoColorOptions.includes(autoFormValues.color)

  return (
    <>
      <FormField label="Марка">
        <Input
          value={autoFormValues.mark}
          onChange={(event) =>
            updateAutoFormValues({ mark: event.target.value })
          }
        />
      </FormField>
      <FormField label="Модель">
        <Input
          value={autoFormValues.model}
          onChange={(event) =>
            updateAutoFormValues({ model: event.target.value })
          }
        />
      </FormField>
      <FormField label="Колір">
        <NativeSelect
          value={autoFormValues.color}
          onChange={(event) =>
            updateAutoFormValues({ color: event.target.value })
          }
        >
          <option value="" disabled>
            Виберіть колір
          </option>
          {isCurrentColorMissingFromOptions && (
            <option value={autoFormValues.color}>{autoFormValues.color}</option>
          )}
          {autoColorOptions.map((autoColorOption) => (
            <option key={autoColorOption} value={autoColorOption}>
              {autoColorOption}
            </option>
          ))}
        </NativeSelect>
      </FormField>
      <FormField label="Номерний знак">
        <Input
          value={autoFormValues.number}
          onChange={(event) =>
            updateAutoFormValues({ number: event.target.value })
          }
        />
      </FormField>
      <FormField label="Місткість (кг)">
        <Input
          type="number"
          min={0}
          step="any"
          value={autoFormValues.capacity}
          onChange={(event) =>
            updateAutoFormValues({ capacity: event.target.value })
          }
        />
      </FormField>
    </>
  )
}
