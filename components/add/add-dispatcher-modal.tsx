"use client"

import { useTranslations } from "next-intl"
import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { FormModal } from "@/components/forms/form-modal"
import { FormSection } from "@/components/forms/form-section"
import { DepotCheckboxList } from "@/components/forms/depot-checkbox-list"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { useFormFieldErrorMessages } from "@/hooks/use-form-field-error-messages"
import { sendApiRequest } from "@/lib/api-client"
import {
  accountPasswordConstraints,
  apiEndpoints,
  dispatcherFormFieldNamesByApiPropertyName,
} from "@/lib/constants"
import {
  createEmptyDispatcherFormValues,
  createRegisterDispatcherRequestModel,
  getDispatcherFormFieldErrors,
} from "@/lib/forms/dispatcher-form"
import { getPasswordPolicyViolation } from "@/lib/forms/password-policy"
import { Depot, DispatcherFormValues, HttpMethod } from "@/lib/types"

interface AddDispatcherModalProps {
  depots: ReadonlyArray<Depot>
}

export default function AddDispatcherModal({
  depots,
}: AddDispatcherModalProps) {
  const dispatcherTranslations = useTranslations("dispatchers")
  const passwordPolicyTranslations = useTranslations("passwordPolicy")
  const commonTranslations = useTranslations("common")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dispatcherFormValues, setDispatcherFormValues] = useState(
    createEmptyDispatcherFormValues
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()
  const {
    formFieldErrorMessages,
    showFormFieldErrors,
    showApiFieldErrorMessages,
    clearChangedFormFieldErrorMessages,
    clearFormFieldErrorMessages,
  } = useFormFieldErrorMessages(dispatcherFormFieldNamesByApiPropertyName)
  const passwordPolicyMessageValues = {
    minLength: accountPasswordConstraints.minLength,
    maxLength: accountPasswordConstraints.maxLength,
  }

  const handleOpen = () => {
    clearFormFieldErrorMessages()
    setIsModalOpen(true)
  }

  const updateDispatcherFormValues = (
    changedValues: Partial<DispatcherFormValues>
  ) => {
    const nextDispatcherFormValues = {
      ...dispatcherFormValues,
      ...changedValues,
    }
    clearChangedFormFieldErrorMessages(
      dispatcherFormValues,
      nextDispatcherFormValues
    )
    setDispatcherFormValues(nextDispatcherFormValues)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const passwordPolicyViolation = getPasswordPolicyViolation(
      dispatcherFormValues.password
    )
    const hasFormFieldErrors = showFormFieldErrors(
      getDispatcherFormFieldErrors(dispatcherFormValues),
      passwordPolicyViolation === null
        ? {}
        : {
            password: passwordPolicyTranslations(
              passwordPolicyViolation,
              passwordPolicyMessageValues
            ),
          }
    )
    if (hasFormFieldErrors) {
      return
    }

    const isDispatcherRegistered = await runApiMutation(
      () =>
        sendApiRequest(
          apiEndpoints.registerAccount,
          HttpMethod.Post,
          createRegisterDispatcherRequestModel(dispatcherFormValues)
        ),
      {
        loading: dispatcherTranslations("createLoading"),
        success: dispatcherTranslations("createSuccess"),
        error: dispatcherTranslations("createError"),
      },
      undefined,
      showApiFieldErrorMessages
    )
    if (isDispatcherRegistered) {
      setDispatcherFormValues(createEmptyDispatcherFormValues())
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button variant="accent" onClick={handleOpen}>
        {dispatcherTranslations("addButtonLabel")}
      </Button>
      <FormModal
        isOpen={isModalOpen}
        title={dispatcherTranslations("addTitle")}
        isSubmitting={isApiMutationRunning}
        submitButtonLabel={commonTranslations("saveButtonLabel")}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <FormSection title={dispatcherTranslations("accountSectionTitle")}>
          <FormField
            label={dispatcherTranslations("usernameLabel")}
            isRequired
            errorMessage={formFieldErrorMessages.username}
          >
            <Input
              value={dispatcherFormValues.username}
              onChange={(event) =>
                updateDispatcherFormValues({ username: event.target.value })
              }
              placeholder="dispatcher_1"
            />
          </FormField>
          <FormField
            label={dispatcherTranslations("emailLabel")}
            isRequired
            errorMessage={formFieldErrorMessages.email}
          >
            <Input
              type="email"
              value={dispatcherFormValues.email}
              onChange={(event) =>
                updateDispatcherFormValues({ email: event.target.value })
              }
              placeholder="disp@fleet.com"
            />
          </FormField>
          <FormField
            label={dispatcherTranslations("passwordLabel")}
            isRequired
            hint={passwordPolicyTranslations(
              "Hint",
              passwordPolicyMessageValues
            )}
            errorMessage={formFieldErrorMessages.password}
            className="sm:col-span-2"
          >
            <Input
              type="password"
              autoComplete="new-password"
              maxLength={accountPasswordConstraints.maxLength}
              value={dispatcherFormValues.password}
              onChange={(event) =>
                updateDispatcherFormValues({ password: event.target.value })
              }
            />
          </FormField>
        </FormSection>
        <FormSection title={dispatcherTranslations("depotsSectionTitle")}>
          <div className="sm:col-span-2">
            <DepotCheckboxList
              depots={depots}
              selectedDepotIds={dispatcherFormValues.depotIds}
              errorMessage={formFieldErrorMessages.depotIds}
              onSelectedDepotIdsChange={(depotIds) =>
                updateDispatcherFormValues({ depotIds })
              }
            />
          </div>
        </FormSection>
      </FormModal>
    </>
  )
}
