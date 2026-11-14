import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { driverFormFields } from "@/lib/constants"
import { DriverFormValues } from "@/lib/types"

interface DriverFormFieldsProps {
  driverFormValues: DriverFormValues
  onDriverFormValuesChange: (driverFormValues: DriverFormValues) => void
}

export function DriverFormFields({
  driverFormValues,
  onDriverFormValuesChange,
}: DriverFormFieldsProps) {
  return (
    <>
      {driverFormFields.map((driverFormField) => (
        <FormField key={driverFormField.name} label={driverFormField.label}>
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
    </>
  )
}
