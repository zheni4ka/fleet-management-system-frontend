"use client"

import { useLocale, useTranslations } from "next-intl"
import { resolveAppLocale } from "@/lib/app-locale"
import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { History, Wrench } from "lucide-react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "@/components/ui/form-field"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { IconActionButton } from "@/components/icon-action-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { fetchApiData, sendApiRequest } from "@/lib/api-client"
import { apiEndpoints } from "@/lib/constants"
import { formatDate } from "@/lib/formatters"
import { useApiErrorMessageResolver } from "@/hooks/use-api-error-message-resolver"
import {
  createCompleteAutoMaintenanceRequestModel,
  createCreateAutoMaintenanceRequestModel,
  createEmptyMaintenanceFormValues,
  getMaintenanceFormValidationError,
} from "@/lib/forms/maintenance-form"
import { autoMaintenanceSchema } from "@/lib/schemas/auto-maintenance-schema"
import { AutoMaintenance, HttpMethod, MaintenanceFormValues } from "@/lib/types"

interface AutoMaintenanceManagementModalProps {
  autoId: number
  autoTitle: string
}

export default function AutoMaintenanceManagementModal({
  autoId,
  autoTitle,
}: AutoMaintenanceManagementModalProps) {
  const appLocale = resolveAppLocale(useLocale())
  const iconActionTranslations = useTranslations("iconActions")
  const maintenanceTranslations = useTranslations("maintenance")
  const formValidationTranslations = useTranslations("formValidation")
  const commonTranslations = useTranslations("common")
  const resolveApiErrorMessage = useApiErrorMessageResolver()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [maintenanceHistory, setMaintenanceHistory] = useState<
    AutoMaintenance[]
  >([])
  const [isMaintenanceHistoryLoading, setIsMaintenanceHistoryLoading] =
    useState(false)
  const [maintenanceHistoryErrorMessage, setMaintenanceHistoryErrorMessage] =
    useState<string | null>(null)
  const [maintenanceFormValues, setMaintenanceFormValues] = useState(
    createEmptyMaintenanceFormValues
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const updateMaintenanceFormValues = (
    changedValues: Partial<MaintenanceFormValues>
  ) => {
    setMaintenanceFormValues({ ...maintenanceFormValues, ...changedValues })
  }

  const loadMaintenanceHistory = async () => {
    setIsMaintenanceHistoryLoading(true)
    setMaintenanceHistoryErrorMessage(null)
    try {
      setMaintenanceHistory(
        await fetchApiData(
          `${apiEndpoints.autoMaintenancesByAutoId}/${autoId}`,
          z.array(autoMaintenanceSchema)
        )
      )
    } catch (error) {
      console.error(maintenanceTranslations("historyLoadFailed"), error)
      setMaintenanceHistoryErrorMessage(
        resolveApiErrorMessage(
          error,
          maintenanceTranslations("historyLoadFailed")
        )
      )
    } finally {
      setIsMaintenanceHistoryLoading(false)
    }
  }

  const handleOpen = () => {
    setIsModalOpen(true)
    void loadMaintenanceHistory()
  }

  const handleComplete = async (maintenanceRecord: AutoMaintenance) => {
    const isMaintenanceCompleted = await runApiMutation(
      () =>
        sendApiRequest(
          apiEndpoints.updateAutoMaintenance,
          HttpMethod.Put,
          createCompleteAutoMaintenanceRequestModel(maintenanceRecord)
        ),
      {
        loading: maintenanceTranslations("completeLoading"),
        success: maintenanceTranslations("completeSuccess"),
        error: maintenanceTranslations("completeError"),
      },
      () => setIsModalOpen(false)
    )
    if (isMaintenanceCompleted) {
      setIsModalOpen(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const maintenanceFormValidationError = getMaintenanceFormValidationError(
      maintenanceFormValues
    )
    if (maintenanceFormValidationError !== null) {
      toast.error(formValidationTranslations(maintenanceFormValidationError))
      return
    }

    const isMaintenanceCreated = await runApiMutation(
      () =>
        sendApiRequest(
          apiEndpoints.createAutoMaintenance,
          HttpMethod.Post,
          createCreateAutoMaintenanceRequestModel(autoId, maintenanceFormValues)
        ),
      {
        loading: maintenanceTranslations("createLoading"),
        success: maintenanceTranslations("createSuccess"),
        error: maintenanceTranslations("createError"),
      }
    )
    if (isMaintenanceCreated) {
      setMaintenanceFormValues(createEmptyMaintenanceFormValues())
      setIsModalOpen(false)
    }
  }

  const renderMaintenanceHistory = () => {
    if (isMaintenanceHistoryLoading) {
      return (
        <p className="animate-pulse py-4 text-center text-sm text-slate-500">
          {commonTranslations("loadingLabel")}
        </p>
      )
    }
    if (maintenanceHistoryErrorMessage !== null) {
      return (
        <p className="rounded-md border border-red-200 bg-red-50 py-4 text-center text-sm text-red-600">
          {maintenanceHistoryErrorMessage}
        </p>
      )
    }
    if (maintenanceHistory.length === 0) {
      return (
        <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 py-4 text-center text-sm text-slate-500">
          {maintenanceTranslations("historyEmpty")}
        </p>
      )
    }
    return (
      <div className="max-h-36 space-y-2 overflow-y-auto pr-2">
        {maintenanceHistory.map((maintenanceRecord) => (
          <div
            key={maintenanceRecord.id}
            className={`rounded-md border p-3 ${maintenanceRecord.isCompleted ? "border-slate-200 bg-slate-50" : "border-orange-300 bg-orange-50"}`}
          >
            <div className="mb-1 flex items-start justify-between">
              <span className="text-sm font-medium text-slate-800">
                {maintenanceRecord.name}{" "}
                {maintenanceRecord.isCompleted
                  ? maintenanceTranslations("completedSuffix")
                  : maintenanceTranslations("inProgressSuffix")}
              </span>
              <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500">
                {formatDate(maintenanceRecord.serviceDate, appLocale)}
              </span>
            </div>
            <p className="mb-2 text-xs text-slate-600">
              {maintenanceRecord.description}
            </p>
            {!maintenanceRecord.isCompleted && (
              <Button
                type="button"
                onClick={() => handleComplete(maintenanceRecord)}
                disabled={isApiMutationRunning}
                size="sm"
                variant="success"
                className="w-full text-xs"
              >
                {maintenanceTranslations("completeButtonLabel")}
              </Button>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <IconActionButton
        icon={Wrench}
        label={iconActionTranslations("maintenance")}
        variant="warning"
        onClick={handleOpen}
      />

      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={maintenanceTranslations("title", { autoTitle })}
      >
        <div className="space-y-5 px-2">
          <section>
            <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <History className="size-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-700">
                {maintenanceTranslations("historyTitle")}
              </h3>
            </div>
            {renderMaintenanceHistory()}
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Wrench className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold text-slate-700">
                {maintenanceTranslations("sendToRepairTitle")}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <FormField label={maintenanceTranslations("workTypeLabel")}>
                <Input
                  placeholder={maintenanceTranslations("workTypePlaceholder")}
                  value={maintenanceFormValues.name}
                  onChange={(event) =>
                    updateMaintenanceFormValues({ name: event.target.value })
                  }
                />
              </FormField>
              <FormField
                label={maintenanceTranslations("problemDescriptionLabel")}
              >
                <Textarea
                  placeholder={maintenanceTranslations(
                    "problemDescriptionPlaceholder"
                  )}
                  value={maintenanceFormValues.description}
                  onChange={(event) =>
                    updateMaintenanceFormValues({
                      description: event.target.value,
                    })
                  }
                  rows={2}
                />
              </FormField>
              <FormField label={maintenanceTranslations("serviceDateLabel")}>
                <Input
                  type="datetime-local"
                  value={maintenanceFormValues.serviceDate}
                  onChange={(event) =>
                    updateMaintenanceFormValues({
                      serviceDate: event.target.value,
                    })
                  }
                />
              </FormField>
              <SubmitButton isSubmitting={isApiMutationRunning}>
                {maintenanceTranslations("registerButtonLabel")}
              </SubmitButton>
            </form>
          </section>
        </div>
      </ModalWindow>
    </>
  )
}
