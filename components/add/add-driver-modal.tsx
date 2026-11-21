"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
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
  createDriverRequestBody,
  createEmptyDriverFormValues,
  getDriverFormFieldErrors,
} from "@/lib/forms/driver-form"
import { Depot, DriverFormValues, HttpMethod } from "@/lib/types"

interface AddDriverModalProps {
  depots: ReadonlyArray<Depot>
}

export default function AddDriverModal({ depots }: AddDriverModalProps) {
  const driverTranslations = useTranslations("drivers")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [driverFormValues, setDriverFormValues] = useState(
    createEmptyDriverFormValues
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

    const isDriverCreated = await runApiMutation(
      () =>
        sendApiRequest(
          apiEndpoints.createDriver,
          HttpMethod.Post,
          createDriverRequestBody(driverFormValues)
        ),
      {
        loading: driverTranslations("createLoading"),
        success: driverTranslations("createSuccess"),
        error: driverTranslations("createError"),
      },
      undefined,
      showApiFieldErrorMessages
    )
    if (isDriverCreated) {
      setDriverFormValues(createEmptyDriverFormValues())
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button hoverEffect="grow" onClick={handleOpen}>
        {driverTranslations("addButtonLabel")}
      </Button>
      <FormModal
        isOpen={isModalOpen}
        title={driverTranslations("addTitle")}
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
