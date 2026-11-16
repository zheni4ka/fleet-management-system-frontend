"use client"

import { useState, type FormEvent } from "react"
import { Pencil } from "lucide-react"
import toast from "react-hot-toast"
import { IconActionButton } from "@/components/icon-action-button"
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
  iconActionLabels,
  routeFormSelectTexts,
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
  AutoLookupOption,
  DriverLookupOption,
  EditRouteFormValues,
  HttpMethod,
  LocationLookupOption,
  Route,
  RouteStatus,
} from "@/lib/types"
import { parseEnumValue } from "@/lib/utils"

interface EditRouteModalProps {
  route: Route
  autoLookupOptions: AutoLookupOption[]
  driverLookupOptions: DriverLookupOption[]
  locationLookupOptions: LocationLookupOption[]
  isRouteUpdating: boolean
}

export default function EditRouteModal({
  route,
  autoLookupOptions,
  driverLookupOptions,
  locationLookupOptions,
  isRouteUpdating,
}: EditRouteModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editRouteFormValues, setEditRouteFormValues] = useState(() =>
    createEditRouteFormValuesFromRoute(route)
  )
  const { isApiMutationRunning, runApiMutation } = useApiMutationWithRefresh()

  const isRouteEditable = isRouteStatusActive(route.status)
  const locationOptions = createLocationSearchableSelectOptions(
    locationLookupOptions
  )
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
          apiEndpoints.updateRoute,
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

  if (!isRouteEditable) {
    return null
  }

  return (
    <>
      <IconActionButton
        icon={Pencil}
        label={iconActionLabels.edit}
        variant="outline"
        disabled={isRouteUpdating}
        onClick={handleOpen}
      />
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
                placeholder={routeFormSelectTexts.startLocationPlaceholder}
                searchPlaceholder={
                  routeFormSelectTexts.locationSearchPlaceholder
                }
                emptyMessage={routeFormSelectTexts.locationEmptyMessage}
              />
            </FormField>
            <FormField label="Кінцева локація">
              <SearchableSelect
                options={locationOptions}
                selectedValue={editRouteFormValues.destinationLocationId}
                onSelectedValueChange={(destinationLocationId) =>
                  updateEditRouteFormValues({ destinationLocationId })
                }
                placeholder={
                  routeFormSelectTexts.destinationLocationPlaceholder
                }
                searchPlaceholder={
                  routeFormSelectTexts.locationSearchPlaceholder
                }
                emptyMessage={routeFormSelectTexts.locationEmptyMessage}
              />
            </FormField>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Водій">
              <SearchableSelect
                options={createDriverSearchableSelectOptions(
                  driverLookupOptions
                )}
                selectedValue={editRouteFormValues.driverId}
                onSelectedValueChange={(driverId) =>
                  updateEditRouteFormValues({ driverId })
                }
                placeholder={routeFormSelectTexts.driverPlaceholder}
                searchPlaceholder={routeFormSelectTexts.driverSearchPlaceholder}
                emptyMessage={routeFormSelectTexts.driverEmptyMessage}
              />
            </FormField>
            <FormField label="Автомобіль">
              <SearchableSelect
                options={createAutoSearchableSelectOptions(
                  autoLookupOptions,
                  route.autoId
                )}
                selectedValue={editRouteFormValues.autoId}
                onSelectedValueChange={(autoId) =>
                  updateEditRouteFormValues({ autoId })
                }
                placeholder={routeFormSelectTexts.autoPlaceholder}
                searchPlaceholder={routeFormSelectTexts.autoSearchPlaceholder}
                emptyMessage={routeFormSelectTexts.autoEmptyMessage}
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
