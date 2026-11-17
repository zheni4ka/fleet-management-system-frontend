"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { DriverFormFields } from "@/components/forms/driver-form-fields"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints } from "@/lib/constants"
import {
  createDriverRequestBody,
  createEmptyDriverFormValues,
  getDriverFormValidationError,
} from "@/lib/forms/driver-form"
import { Depot, HttpMethod } from "@/lib/types"

interface AddDriverModalProps {
  depots: ReadonlyArray<Depot>
}

export default function AddDriverModal({ depots }: AddDriverModalProps) {
  const driverTranslations = useTranslations("drivers")
  const formValidationTranslations = useTranslations("formValidation")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [driverFormValues, setDriverFormValues] = useState(
    createEmptyDriverFormValues
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const driverFormValidationError =
      getDriverFormValidationError(driverFormValues)
    if (driverFormValidationError !== null) {
      toast.error(formValidationTranslations(driverFormValidationError))
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
      }
    )
    if (isDriverCreated) {
      setDriverFormValues(createEmptyDriverFormValues())
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button hoverEffect="grow" onClick={() => setIsModalOpen(true)}>
        {driverTranslations("addButtonLabel")}
      </Button>
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={driverTranslations("addTitle")}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <DriverFormFields
            depots={depots}
            driverFormValues={driverFormValues}
            onDriverFormValuesChange={setDriverFormValues}
          />
          <SubmitButton isSubmitting={isApiMutationRunning}>
            {commonTranslations("saveButtonLabel")}
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
