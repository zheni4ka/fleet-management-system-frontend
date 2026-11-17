"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { Pencil } from "lucide-react"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { IconActionButton } from "@/components/icon-action-button"
import { DriverFormFields } from "@/components/forms/driver-form-fields"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import { apiEndpoints } from "@/lib/constants"
import {
  createDriverFormValuesFromDriver,
  createDriverRequestBody,
  getDriverFormValidationError,
} from "@/lib/forms/driver-form"
import { Driver, Depot, HttpMethod } from "@/lib/types"

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
  const formValidationTranslations = useTranslations("formValidation")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [driverFormValues, setDriverFormValues] = useState(() =>
    createDriverFormValuesFromDriver(driver)
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const handleOpen = () => {
    setDriverFormValues(createDriverFormValuesFromDriver(driver))
    setIsModalOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const driverFormValidationError =
      getDriverFormValidationError(driverFormValues)
    if (driverFormValidationError !== null) {
      toast.error(formValidationTranslations(driverFormValidationError))
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
      () => setIsModalOpen(false)
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
      <ModalWindow
        title={driverTranslations("editTitle")}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
