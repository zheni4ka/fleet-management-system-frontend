"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import { Pencil } from "lucide-react"
import { IconActionButton } from "@/components/icon-action-button"
import { FormModal } from "@/components/forms/form-modal"
import { FormSection } from "@/components/forms/form-section"
import { DriverFormFields } from "@/components/forms/driver-form-fields"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { useFormFieldErrorMessages } from "@/hooks/use-form-field-error-messages"
import { sendApiRequest } from "@/lib/api-client"
import {
  apiEndpoints,
  driverFormFieldNamesByApiPropertyName,
} from "@/lib/constants"
import {
  createDriverFormValuesFromDriver,
  createDriverRequestBody,
  getDriverFormFieldErrors,
} from "@/lib/forms/driver-form"
import { Depot, Driver, DriverFormValues, HttpMethod } from "@/lib/types"

interface EditDriverModalProps {
  driver: Driver
  depots: ReadonlyArray<Depot>
}

export default function EditDriverModal({
  driver,
  depots,
}: EditDriverModalProps) {
  const iconActionTranslations = useTranslations("iconActions")
  const driverTranslations = useTranslations("drivers")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [driverFormValues, setDriverFormValues] = useState(() =>
    createDriverFormValuesFromDriver(driver)
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()
  const {
    formFieldErrorMessages,
    showFormFieldErrors,
    showApiFieldErrorMessages,
    clearChangedFormFieldErrorMessages,
    clearFormFieldErrorMessages,
  } = useFormFieldErrorMessages(driverFormFieldNamesByApiPropertyName)

  const handleOpen = () => {
    setDriverFormValues(createDriverFormValuesFromDriver(driver))
    clearFormFieldErrorMessages()
    setIsModalOpen(true)
  }

  const handleDriverFormValuesChange = (
    nextDriverFormValues: DriverFormValues
  ) => {
    clearChangedFormFieldErrorMessages(driverFormValues, nextDriverFormValues)
    setDriverFormValues(nextDriverFormValues)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (showFormFieldErrors(getDriverFormFieldErrors(driverFormValues))) {
      return
    }

    const isDriverUpdated = await runApiMutation(
      () =>
        sendApiRequest(apiEndpoints.updateDriver, HttpMethod.Put, {
          id: driver.id,
          rowVersion: driver.rowVersion,
          ...createDriverRequestBody(driverFormValues),
        }),
      {
        loading: driverTranslations("updateLoading"),
        success: driverTranslations("updateSuccess"),
        error: driverTranslations("updateError"),
      },
      () => setIsModalOpen(false),
      showApiFieldErrorMessages
    )
    if (isDriverUpdated) {
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <IconActionButton
        icon={Pencil}
        label={iconActionTranslations("edit")}
        variant="outline"
        onClick={handleOpen}
      />
      <FormModal
        isOpen={isModalOpen}
        title={driverTranslations("editTitle")}
        isSubmitting={isApiMutationRunning}
        submitButtonLabel={commonTranslations("saveButtonLabel")}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <FormSection title={driverTranslations("detailsSectionTitle")}>
          <DriverFormFields
            depots={depots}
            driverFormValues={driverFormValues}
            formFieldErrorMessages={formFieldErrorMessages}
            onDriverFormValuesChange={handleDriverFormValuesChange}
          />
        </FormSection>
      </FormModal>
    </>
  )
}
