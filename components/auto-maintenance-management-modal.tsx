"use client"

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
import { apiEndpoints, iconActionLabels } from "@/lib/constants"
import { formatDate } from "@/lib/formatters"
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
      console.error("Не вдалося завантажити історію ТО:", error)
      setMaintenanceHistoryErrorMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося завантажити історію ТО"
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
        loading: "Завершення ТО...",
        success: "ТО успішно завершено! Авто знову доступне.",
        error: "Помилка при завершенні ТО.",
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
      toast.error(maintenanceFormValidationError)
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
        loading: "Збереження запису...",
        success: "Автомобіль відправлено на ТО!",
        error: "Помилка при створенні запису.",
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
          Завантаження...
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
          Записів ще немає. Автомобіль справний.
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
                {maintenanceRecord.isCompleted ? "(Завершено)" : "(В процесі)"}
              </span>
              <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500">
                {formatDate(maintenanceRecord.serviceDate)}
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
                Завершити ремонт
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
        label={iconActionLabels.maintenance}
        variant="warning"
        onClick={handleOpen}
      />

      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Технічне обслуговування: ${autoTitle}`}
      >
        <div className="space-y-5 px-2">
          <section>
            <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <History className="size-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-700">
                Історія обслуговування
              </h3>
            </div>
            {renderMaintenanceHistory()}
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Wrench className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold text-slate-700">
                Відправити на ремонт
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <FormField label="Тип робіт">
                <Input
                  placeholder="Напр., Заміна мастила"
                  value={maintenanceFormValues.name}
                  onChange={(event) =>
                    updateMaintenanceFormValues({ name: event.target.value })
                  }
                />
              </FormField>
              <FormField label="Опис проблеми">
                <Textarea
                  placeholder="Детальний опис проблеми..."
                  value={maintenanceFormValues.description}
                  onChange={(event) =>
                    updateMaintenanceFormValues({
                      description: event.target.value,
                    })
                  }
                  rows={2}
                />
              </FormField>
              <FormField label="Дата початку робіт">
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
                Зареєструвати ТО
              </SubmitButton>
            </form>
          </section>
        </div>
      </ModalWindow>
    </>
  )
}
