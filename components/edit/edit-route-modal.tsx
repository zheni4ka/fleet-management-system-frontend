"use client"

import { useState, type FormEvent } from "react"
import { Pencil } from "lucide-react"
import toast from "react-hot-toast"
import { NativeSelect } from "@/components/ui/native-select"
import { FormField } from "@/components/ui/form-field"
import ModalWindow from "@/components/ui/modal-window"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { SubmitButton } from "@/components/ui/submit-button"
import { useApiMutationWithRefresh } from "@/hooks/use-api-mutation-with-refresh"
import { sendApiRequest } from "@/lib/api-client"
import {
  allowedRouteStatusTransitions,
  apiEndpoints,
  routeStatusLabels,
} from "@/lib/constants"
import {
  createEditRouteFormValuesFromRoute,
  createEditRouteRequestBody,
  getEditRouteFormValidationError,
} from "@/lib/forms/edit-route-form"
import {
  createAutoSearchableSelectOptions,
  createDriverSearchableSelectOptions,
  createLocationSearchableSelectOptions,
} from "@/lib/forms/searchable-select-options"
import { isRouteStatusActive } from "@/lib/route-status"
import {
  Auto,
  Driver,
  EditRouteFormValues,
  HttpMethod,
  Location,
  Route,
  RouteStatus,
} from "@/lib/types"
import { parseEnumValue } from "@/lib/utils"

interface EditRouteModalProps {
  route: Route
  autos: Auto[]
  drivers: Driver[]
  locations: Location[]
  isRouteUpdating: boolean
}

export default function EditRouteModal({
  route,
  autos,
  drivers,
  locations,
  isRouteUpdating,
}: EditRouteModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editRouteFormValues, setEditRouteFormValues] = useState(() =>
    createEditRouteFormValuesFromRoute(route)
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const isRouteEditable = isRouteStatusActive(route.status)
  const locationOptions = createLocationSearchableSelectOptions(locations)
  const selectableRouteStatuses = [
    route.status,
    ...allowedRouteStatusTransitions[route.status],
  ]

  const updateEditRouteFormValues = (
    changedValues: Partial<EditRouteFormValues>
  ) => {
    setEditRouteFormValues({ ...editRouteFormValues, ...changedValues })
  }

  const handleOpen = () => {
    setEditRouteFormValues(createEditRouteFormValuesFromRoute(route))
    setIsModalOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const editRouteFormValidationError =
      getEditRouteFormValidationError(editRouteFormValues)
    if (editRouteFormValidationError !== null) {
      toast.error(editRouteFormValidationError)
      return
    }

    const isRouteUpdated = await runApiMutation(
      () =>
        sendApiRequest(
          `${apiEndpoints.routes}/${route.id}`,
          HttpMethod.Put,
          createEditRouteRequestBody(route.id, editRouteFormValues)
        ),
      {
        loading: "Збереження змін маршруту...",
        success: "Маршрут успішно оновлено!",
        error: "Не вдалося оновити маршрут",
      }
    )
    if (isRouteUpdated) {
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={isRouteUpdating || !isRouteEditable}
        title={
          isRouteEditable
            ? undefined
            : "Завершені та скасовані маршрути не редагуються"
        }
        className="flex w-full cursor-pointer items-center justify-center rounded-md border border-slate-200 p-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleOpen}
      >
        <Pencil className="mr-2 h-4 w-4" /> Редагувати
      </button>
      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Редагувати маршрут #${route.id}`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Початкова локація">
              <SearchableSelect
                options={locationOptions}
                selectedValue={editRouteFormValues.startLocationId}
                onSelectedValueChange={(startLocationId) =>
                  updateEditRouteFormValues({ startLocationId })
                }
                placeholder="Оберіть початкову локацію"
                searchPlaceholder="Пошук міста або країни..."
                emptyMessage="Локацію не знайдено"
              />
            </FormField>
            <FormField label="Кінцева локація">
              <SearchableSelect
                options={locationOptions}
                selectedValue={editRouteFormValues.destinationLocationId}
                onSelectedValueChange={(destinationLocationId) =>
                  updateEditRouteFormValues({ destinationLocationId })
                }
                placeholder="Оберіть кінцеву локацію"
                searchPlaceholder="Пошук міста або країни..."
                emptyMessage="Локацію не знайдено"
              />
            </FormField>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Водій">
              <SearchableSelect
                options={createDriverSearchableSelectOptions(drivers)}
                selectedValue={editRouteFormValues.driverId}
                onSelectedValueChange={(driverId) =>
                  updateEditRouteFormValues({ driverId })
                }
                placeholder="Оберіть водія"
                searchPlaceholder="Пошук за ПІБ або посвідченням..."
                emptyMessage="Водія не знайдено"
              />
            </FormField>
            <FormField label="Автомобіль">
              <SearchableSelect
                options={createAutoSearchableSelectOptions(autos, route.autoId)}
                selectedValue={editRouteFormValues.autoId}
                onSelectedValueChange={(autoId) =>
                  updateEditRouteFormValues({ autoId })
                }
                placeholder="Оберіть авто"
                searchPlaceholder="Пошук за маркою або номером..."
                emptyMessage="Автомобіль не знайдено"
              />
            </FormField>
          </div>

          <FormField label="Статус маршруту">
            <NativeSelect
              value={editRouteFormValues.status}
              onChange={(event) =>
                updateEditRouteFormValues({
                  status: parseEnumValue(RouteStatus, event.target.value),
                })
              }
            >
              {selectableRouteStatuses.map((routeStatus) => (
                <option key={routeStatus} value={routeStatus}>
                  {routeStatusLabels[routeStatus]}
                </option>
              ))}
            </NativeSelect>
          </FormField>

          <p className="text-xs text-slate-500">
            Час відправлення та прибуття після створення маршруту не змінюється.
          </p>

          <SubmitButton isSubmitting={isApiMutationRunning}>
            Зберегти зміни
          </SubmitButton>
        </form>
      </ModalWindow>
    </>
  )
}
