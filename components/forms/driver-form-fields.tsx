import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { driverFormFields } from "@/lib/constants"
import { DepotSelectField } from "@/components/forms/depot-select-field"
import { Depot, DriverFormValues, FormFieldErrorMessages } from "@/lib/types"

interface DriverFormFieldsProps {
  depots: ReadonlyArray<Depot>
  driverFormValues: DriverFormValues
  formFieldErrorMessages: FormFieldErrorMessages<string>
  onDriverFormValuesChange: (driverFormValues: DriverFormValues) => void
}

export function DriverFormFields({
  depots,
  driverFormValues,
  formFieldErrorMessages,
  onDriverFormValuesChange,
}: DriverFormFieldsProps) {
  const driverTranslations = useTranslations("drivers")
  return (
    <>
      {driverFormFields.map((driverFormField) => (
        <FormField
          key={driverFormField.name}
          label={driverTranslations(driverFormField.labelMessageKey)}
          isRequired
          hint={
            driverFormField.hintMessageKey === null
              ? undefined
              : driverTranslations(driverFormField.hintMessageKey)
          }
          errorMessage={formFieldErrorMessages[driverFormField.name]}
        >
          <Input
            value={driverFormValues[driverFormField.name]}
            onChange={(event) =>
              onDriverFormValuesChange({
                ...driverFormValues,
                [driverFormField.name]: event.target.value,
              })
            }
          />
        </FormField>
      ))}
      <DepotSelectField
        depots={depots}
        selectedDepotId={driverFormValues.depotId}
        errorMessage={formFieldErrorMessages.depotId}
        onSelectedDepotIdChange={(selectedDepotId) =>
          onDriverFormValuesChange({
            ...driverFormValues,
            depotId: selectedDepotId,
          })
        }
      />
    </>
  )
}
