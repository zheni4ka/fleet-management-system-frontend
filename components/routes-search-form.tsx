"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { FormField } from "@/components/ui/form-field"
import { appRoutes, firstListPage, routeStatusLabels } from "@/lib/constants"
import {
  formatAutoTitleWithNumber,
  formatDriverFullName,
} from "@/lib/formatters"
import { createListPageHref } from "@/lib/search-params"
import {
  Auto,
  Driver,
  ListPageState,
  RouteSortField,
  RouteStatus,
  RoutesSearchFormValues,
} from "@/lib/types"

interface RoutesSearchFormProps {
  initialRoutesSearchFormValues: RoutesSearchFormValues
  routesListPageState: ListPageState<RouteSortField>
  autos: Auto[]
  drivers: Driver[]
}

export function RoutesSearchForm({
  initialRoutesSearchFormValues,
  routesListPageState,
  autos,
  drivers,
}: RoutesSearchFormProps) {
  const router = useRouter()
  const [routesSearchFormValues, setRoutesSearchFormValues] = useState(
    initialRoutesSearchFormValues
  )

  const updateRoutesSearchFormValues = (
    changedValues: Partial<RoutesSearchFormValues>
  ) => {
    setRoutesSearchFormValues({ ...routesSearchFormValues, ...changedValues })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isDeparturePeriodReversed =
      routesSearchFormValues.departureFromDate !== "" &&
      routesSearchFormValues.departureToDate !== "" &&
      routesSearchFormValues.departureToDate <
        routesSearchFormValues.departureFromDate
    if (isDeparturePeriodReversed) {
      toast.error("Кінцева дата відправлення не може бути раніше за початкову.")
      return
    }
    router.push(
      createListPageHref(
        routesListPageState,
        { page: firstListPage },
        routesSearchFormValues
      )
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border bg-white p-4 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-slate-700">
        Розширений пошук маршрутів
      </h2>
      <div className="grid gap-3 md:grid-cols-4">
        <FormField label="Місто відправлення">
          <Input
            value={routesSearchFormValues.startCity}
            onChange={(event) =>
              updateRoutesSearchFormValues({ startCity: event.target.value })
            }
          />
        </FormField>
        <FormField label="Місто прибуття">
          <Input
            value={routesSearchFormValues.destinationCity}
            onChange={(event) =>
              updateRoutesSearchFormValues({
                destinationCity: event.target.value,
              })
            }
          />
        </FormField>
        <FormField label="Відправлення з">
          <Input
            type="date"
            value={routesSearchFormValues.departureFromDate}
            onChange={(event) =>
              updateRoutesSearchFormValues({
                departureFromDate: event.target.value,
              })
            }
          />
        </FormField>
        <FormField label="Відправлення по">
          <Input
            type="date"
            value={routesSearchFormValues.departureToDate}
            onChange={(event) =>
              updateRoutesSearchFormValues({
                departureToDate: event.target.value,
              })
            }
          />
        </FormField>
        <FormField label="Статус">
          <NativeSelect
            value={routesSearchFormValues.status}
            onChange={(event) =>
              updateRoutesSearchFormValues({ status: event.target.value })
            }
          >
            <option value="">Усі статуси</option>
            {Object.values(RouteStatus).map((routeStatus) => (
              <option key={routeStatus} value={routeStatus}>
                {routeStatusLabels[routeStatus]}
              </option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField label="Водій">
          <NativeSelect
            value={routesSearchFormValues.driverId}
            onChange={(event) =>
              updateRoutesSearchFormValues({ driverId: event.target.value })
            }
          >
            <option value="">Усі водії</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {formatDriverFullName(driver)}
              </option>
            ))}
          </NativeSelect>
        </FormField>
        <FormField label="Автомобіль">
          <NativeSelect
            value={routesSearchFormValues.autoId}
            onChange={(event) =>
              updateRoutesSearchFormValues({ autoId: event.target.value })
            }
          >
            <option value="">Усі автомобілі</option>
            {autos.map((auto) => (
              <option key={auto.id} value={auto.id}>
                {formatAutoTitleWithNumber(auto)}
              </option>
            ))}
          </NativeSelect>
        </FormField>
        <div className="flex items-end gap-2">
          <Button type="submit" className="flex-1 cursor-pointer">
            Знайти
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={() => router.push(appRoutes.routes)}
          >
            Скинути
          </Button>
        </div>
      </div>
    </form>
  )
}

export default RoutesSearchForm
