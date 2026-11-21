import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { FormSection } from "@/components/forms/form-section"
import { DepotSelectField } from "@/components/forms/depot-select-field"
import { driverContactConstraints, driverFormFields } from "@/lib/constants"
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
  const updateDriverFormValues = (changedValues: Partial<DriverFormValues>) => {
    onDriverFormValuesChange({ ...driverFormValues, ...changedValues })
  }

  return (
    <>
      <FormSection title={driverTranslations("detailsSectionTitle")}>
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
                updateDriverFormValues({
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
            updateDriverFormValues({ depotId: selectedDepotId })
          }
        />
      </FormSection>

      <FormSection title={driverTranslations("contactsSectionTitle")}>
        <FormField
          label={driverTranslations("phoneNumberLabel")}
          hint={driverTranslations("phoneNumberHint")}
          errorMessage={formFieldErrorMessages.phoneNumber}
        >
          <Input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={driverContactConstraints.phoneNumberMaxLength}
            placeholder="+380671234567"
            value={driverFormValues.phoneNumber}
            onChange={(event) =>
              updateDriverFormValues({ phoneNumber: event.target.value })
            }
          />
        </FormField>
        <FormField
          label={driverTranslations("emailLabel")}
          errorMessage={formFieldErrorMessages.email}
        >
          <Input
            type="email"
            autoComplete="email"
            placeholder="driver@fleet.com"
            value={driverFormValues.email}
            onChange={(event) =>
              updateDriverFormValues({ email: event.target.value })
            }
          />
        </FormField>
      </FormSection>
    </>
  )
}
