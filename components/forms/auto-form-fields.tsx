import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { FormField } from "@/components/ui/form-field"
import { autoColorOptions } from "@/lib/constants"
import { DepotSelectField } from "@/components/forms/depot-select-field"
import { AutoFormValues, Depot, FormFieldErrorMessages } from "@/lib/types"

interface AutoFormFieldsProps {
  depots: ReadonlyArray<Depot>
  autoFormValues: AutoFormValues
  formFieldErrorMessages: FormFieldErrorMessages<string>
  onAutoFormValuesChange: (autoFormValues: AutoFormValues) => void
}

export function AutoFormFields({
  depots,
  autoFormValues,
  formFieldErrorMessages,
  onAutoFormValuesChange,
}: AutoFormFieldsProps) {
  const autoTranslations = useTranslations("autos")
  const updateAutoFormValues = (changedValues: Partial<AutoFormValues>) => {
    onAutoFormValuesChange({ ...autoFormValues, ...changedValues })
  }

  const isCurrentColorMissingFromOptions =
    autoFormValues.color !== "" &&
    !autoColorOptions.includes(autoFormValues.color)

  return (
    <>
      <FormField
        label={autoTranslations("markLabel")}
        isRequired
        errorMessage={formFieldErrorMessages.mark}
      >
        <Input
          value={autoFormValues.mark}
          onChange={(event) =>
            updateAutoFormValues({ mark: event.target.value })
          }
        />
      </FormField>
      <FormField
        label={autoTranslations("modelLabel")}
        isRequired
        errorMessage={formFieldErrorMessages.model}
      >
        <Input
          value={autoFormValues.model}
          onChange={(event) =>
            updateAutoFormValues({ model: event.target.value })
          }
        />
      </FormField>
      <FormField
        label={autoTranslations("colorLabel")}
        isRequired
        errorMessage={formFieldErrorMessages.color}
      >
        <NativeSelect
          value={autoFormValues.color}
          onChange={(event) =>
            updateAutoFormValues({ color: event.target.value })
          }
        >
          <option value="" disabled>
            {autoTranslations("colorPlaceholder")}
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
      <FormField
        label={autoTranslations("numberLabel")}
        isRequired
        hint={autoTranslations("numberHint")}
        errorMessage={formFieldErrorMessages.number}
      >
        <Input
          value={autoFormValues.number}
          onChange={(event) =>
            updateAutoFormValues({ number: event.target.value })
          }
        />
      </FormField>
      <FormField
        label={autoTranslations("capacityLabel")}
        isRequired
        errorMessage={formFieldErrorMessages.capacity}
      >
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
      <DepotSelectField
        depots={depots}
        selectedDepotId={autoFormValues.depotId}
        errorMessage={formFieldErrorMessages.depotId}
        onSelectedDepotIdChange={(selectedDepotId) =>
          updateAutoFormValues({ depotId: selectedDepotId })
        }
      />
    </>
  )
}
