"use client"

import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { History, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import ModalWindow from "@/components/ui/modal-window"
import { SubmitButton } from "@/components/ui/submit-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { fetchApiData, sendApiRequest } from "@/lib/api-client"
import { apiEndpoints } from "@/lib/constants"
import { formatDate } from "@/lib/formatters"
import { AutoMaintenance, HttpMethod, MaintenanceFormValues } from "@/lib/types"

interface AutoMaintenanceModalProps {
  autoId: number
  autoTitle: string
}

function createEmptyMaintenanceFormValues(): MaintenanceFormValues {
  return { name: "", description: "", serviceDate: "" }
}

export default function AutoMaintenanceModal({
  autoId,
  autoTitle,
}: AutoMaintenanceModalProps) {
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
        await fetchApiData<AutoMaintenance[]>(
          `${apiEndpoints.autoMaintenanceByAuto}/${autoId}`
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
        sendApiRequest(apiEndpoints.autoMaintenance, HttpMethod.Put, {
          ...maintenanceRecord,
          isCompleted: true,
        }),
      {
        loading: "Завершення ТО...",
        success: "ТО успішно завершено! Авто знову доступне.",
        error: "Помилка при завершенні ТО.",
      }
    )
    if (isMaintenanceCompleted) {
      setIsModalOpen(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const hasEmptyRequiredField = Object.values(maintenanceFormValues).some(
      (maintenanceFieldValue) => maintenanceFieldValue.trim() === ""
    )
    if (hasEmptyRequiredField) {
      toast.error("Заповніть всі поля!")
      return
    }

    const isMaintenanceCreated = await runApiMutation(
      () =>
        sendApiRequest(apiEndpoints.autoMaintenance, HttpMethod.Post, {
          name: maintenanceFormValues.name.trim(),
          description: maintenanceFormValues.description.trim(),
          serviceDate: maintenanceFormValues.serviceDate,
          autoId,
        }),
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
                className="h-7 w-full bg-green-700 text-xs text-white hover:bg-green-800"
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
      <Button
        variant="outline"
        size="sm"
        className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
        onClick={handleOpen}
      >
        ТО
      </Button>

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
                <textarea
                  placeholder="Детальний опис проблеми..."
                  value={maintenanceFormValues.description}
                  onChange={(event) =>
                    updateMaintenanceFormValues({
                      description: event.target.value,
                    })
                  }
                  rows={2}
                  className="w-full resize-none rounded-lg border border-input bg-white px-2.5 py-2 text-sm font-normal text-slate-900 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
