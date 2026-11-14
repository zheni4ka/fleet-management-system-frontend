import {
  auditActionLabels,
  autoColorOptions,
  autoStatusLabels,
  listSearchParamNames,
  routeStatusLabels,
} from "@/lib/constants"
import {
  formatAutoTitleWithNumber,
  formatDriverFullName,
} from "@/lib/formatters"
import {
  AuditAction,
  Auto,
  AutoStatus,
  Driver,
  ListFilterField,
  ListFilterFieldKind,
  ListFilterOption,
  RouteStatus,
  TextListFilterField,
} from "@/lib/types"

const statusFilterLabel = "Статус"
const allStatusesOptionLabel = "Усі статуси"

function createListSearchFilterField(placeholder: string): TextListFilterField {
  return {
    kind: ListFilterFieldKind.Text,
    name: listSearchParamNames.search,
    label: "Пошук",
    placeholder,
  }
}

function createListFilterOptionsFromLabels<TEnumValue extends string>(
  enumValueLabels: Readonly<Record<TEnumValue, string>>,
  enumObject: Record<string, TEnumValue>
): ReadonlyArray<ListFilterOption> {
  return Object.values(enumObject).map((enumValue) => ({
    value: enumValue,
    label: enumValueLabels[enumValue],
  }))
}

export const autosListFilterFields: ReadonlyArray<ListFilterField> =
  Object.freeze([
    createListSearchFilterField("Марка, модель, колір або номер"),
    {
      kind: ListFilterFieldKind.Select,
      name: "status",
      label: statusFilterLabel,
      allOptionsLabel: allStatusesOptionLabel,
      options: createListFilterOptionsFromLabels(autoStatusLabels, AutoStatus),
    },
    {
      kind: ListFilterFieldKind.Select,
      name: "color",
      label: "Колір",
      allOptionsLabel: "Усі кольори",
      options: autoColorOptions.map((autoColor) => ({
        value: autoColor,
        label: autoColor,
      })),
    },
  ])

export const driversListFilterFields: ReadonlyArray<ListFilterField> =
  Object.freeze([
    createListSearchFilterField("Ім'я, прізвище, по батькові або посвідчення"),
  ])

export const dispatchersListFilterFields: ReadonlyArray<ListFilterField> =
  Object.freeze([createListSearchFilterField("Логін або email")])

export const locationsListFilterFields: ReadonlyArray<ListFilterField> =
  Object.freeze([
    createListSearchFilterField("Місто або країна"),
    {
      kind: ListFilterFieldKind.Text,
      name: "country",
      label: "Країна",
      placeholder: "Наприклад, Ukraine",
    },
  ])

export const auditLogsListFilterFields: ReadonlyArray<ListFilterField> =
  Object.freeze([
    createListSearchFilterField("Користувач або ID об'єкта"),
    {
      kind: ListFilterFieldKind.Select,
      name: "action",
      label: "Дія",
      allOptionsLabel: "Усі дії",
      options: createListFilterOptionsFromLabels(
        auditActionLabels,
        AuditAction
      ),
    },
    {
      kind: ListFilterFieldKind.Date,
      name: "timeFromDate",
      label: "Дата з",
    },
    {
      kind: ListFilterFieldKind.Date,
      name: "timeToDate",
      label: "Дата по",
      rangeStartFieldName: "timeFromDate",
    },
  ])

export function createRoutesListFilterFields(
  autos: ReadonlyArray<Auto>,
  drivers: ReadonlyArray<Driver>
): ReadonlyArray<ListFilterField> {
  return [
    {
      kind: ListFilterFieldKind.Text,
      name: "startCity",
      label: "Місто відправлення",
      placeholder: "",
    },
    {
      kind: ListFilterFieldKind.Text,
      name: "destinationCity",
      label: "Місто прибуття",
      placeholder: "",
    },
    {
      kind: ListFilterFieldKind.Date,
      name: "departureFromDate",
      label: "Відправлення з",
    },
    {
      kind: ListFilterFieldKind.Date,
      name: "departureToDate",
      label: "Відправлення по",
      rangeStartFieldName: "departureFromDate",
    },
    {
      kind: ListFilterFieldKind.Select,
      name: "status",
      label: statusFilterLabel,
      allOptionsLabel: allStatusesOptionLabel,
      options: createListFilterOptionsFromLabels(
        routeStatusLabels,
        RouteStatus
      ),
    },
    {
      kind: ListFilterFieldKind.Select,
      name: "driverId",
      label: "Водій",
      allOptionsLabel: "Усі водії",
      options: drivers.map((driver) => ({
        value: String(driver.id),
        label: formatDriverFullName(driver),
      })),
    },
    {
      kind: ListFilterFieldKind.Select,
      name: "autoId",
      label: "Автомобіль",
      allOptionsLabel: "Усі автомобілі",
      options: autos.map((auto) => ({
        value: String(auto.id),
        label: formatAutoTitleWithNumber(auto),
      })),
    },
    createListSearchFilterField("Місто або країна відправлення чи прибуття"),
  ]
}
