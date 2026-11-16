import {
  auditActionLabels,
  autoColorOptions,
  autoStatusLabels,
  archivedRecordsFilterValue,
  listFilterSearchParamNames,
  listFilterTexts,
  listSearchParamNames,
  routeStatusLabels,
} from "@/lib/constants"
import {
  formatAutoTitleWithNumber,
  formatDriverFullName,
} from "@/lib/formatters"
import {
  AuditAction,
  AutoLookupOption,
  AutoStatus,
  Depot,
  DriverLookupOption,
  ListFilterField,
  ListFilterFieldKind,
  ListFilterOption,
  RouteStatus,
  SelectListFilterField,
  TextListFilterField,
} from "@/lib/types"

function createListSearchFilterField(placeholder: string): TextListFilterField {
  return {
    kind: ListFilterFieldKind.Text,
    name: listSearchParamNames.search,
    label: "Пошук",
    placeholder,
  }
}

function createArchiveStateListFilterField(): SelectListFilterField {
  return {
    kind: ListFilterFieldKind.Select,
    name: listFilterSearchParamNames.isArchived,
    label: listFilterTexts.archiveStateLabel,
    allOptionsLabel: listFilterTexts.activeRecordsOptionLabel,
    options: [
      {
        value: archivedRecordsFilterValue,
        label: listFilterTexts.archivedRecordsOptionLabel,
      },
    ],
  }
}

function createDepotListFilterField(
  depots: ReadonlyArray<Depot>
): SelectListFilterField {
  return {
    kind: ListFilterFieldKind.Select,
    name: listFilterSearchParamNames.depotId,
    label: listFilterTexts.depotLabel,
    allOptionsLabel: listFilterTexts.allDepotsOptionLabel,
    options: depots.map((depot) => ({
      value: String(depot.id),
      label: depot.name,
    })),
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

export function createAutosListFilterFields(
  depots: ReadonlyArray<Depot>
): ReadonlyArray<ListFilterField> {
  return [
    createListSearchFilterField("ID, марка, модель, номер"),
    {
      kind: ListFilterFieldKind.Select,
      name: listFilterSearchParamNames.status,
      label: listFilterTexts.statusLabel,
      allOptionsLabel: listFilterTexts.allStatusesOptionLabel,
      options: createListFilterOptionsFromLabels(autoStatusLabels, AutoStatus),
    },
    {
      kind: ListFilterFieldKind.Select,
      name: listFilterSearchParamNames.color,
      label: "Колір",
      allOptionsLabel: "Усі кольори",
      options: autoColorOptions.map((autoColor) => ({
        value: autoColor,
        label: autoColor,
      })),
    },
    createDepotListFilterField(depots),
    createArchiveStateListFilterField(),
  ]
}

export function createDriversListFilterFields(
  depots: ReadonlyArray<Depot>
): ReadonlyArray<ListFilterField> {
  return [
    createListSearchFilterField("ID, ПІБ або посвідчення"),
    createDepotListFilterField(depots),
    createArchiveStateListFilterField(),
  ]
}

export const dispatchersListFilterFields: ReadonlyArray<ListFilterField> =
  Object.freeze([createListSearchFilterField("ID, логін або email")])

export const locationsListFilterFields: ReadonlyArray<ListFilterField> =
  Object.freeze([
    createListSearchFilterField("ID, місто або країна"),
    {
      kind: ListFilterFieldKind.Text,
      name: listFilterSearchParamNames.country,
      label: "Країна",
      placeholder: "Наприклад, Ukraine",
    },
    createArchiveStateListFilterField(),
  ])

export const auditLogsListFilterFields: ReadonlyArray<ListFilterField> =
  Object.freeze([
    createListSearchFilterField("Користувач або ID об'єкта"),
    {
      kind: ListFilterFieldKind.Select,
      name: listFilterSearchParamNames.action,
      label: "Дія",
      allOptionsLabel: "Усі дії",
      options: createListFilterOptionsFromLabels(
        auditActionLabels,
        AuditAction
      ),
    },
    {
      kind: ListFilterFieldKind.Date,
      name: listFilterSearchParamNames.timeFromDate,
      label: "Дата з",
    },
    {
      kind: ListFilterFieldKind.Date,
      name: listFilterSearchParamNames.timeToDate,
      label: "Дата по",
      rangeStartFieldName: listFilterSearchParamNames.timeFromDate,
    },
  ])

export function createRoutesListFilterFields(
  autoLookupOptions: ReadonlyArray<AutoLookupOption>,
  driverLookupOptions: ReadonlyArray<DriverLookupOption>,
  depots: ReadonlyArray<Depot>
): ReadonlyArray<ListFilterField> {
  return [
    {
      kind: ListFilterFieldKind.Text,
      name: listFilterSearchParamNames.startCity,
      label: "Місто відправлення",
      placeholder: "",
    },
    {
      kind: ListFilterFieldKind.Text,
      name: listFilterSearchParamNames.destinationCity,
      label: "Місто прибуття",
      placeholder: "",
    },
    {
      kind: ListFilterFieldKind.Date,
      name: listFilterSearchParamNames.departureFromDate,
      label: "Відправлення з",
    },
    {
      kind: ListFilterFieldKind.Date,
      name: listFilterSearchParamNames.departureToDate,
      label: "Відправлення по",
      rangeStartFieldName: listFilterSearchParamNames.departureFromDate,
    },
    {
      kind: ListFilterFieldKind.Select,
      name: listFilterSearchParamNames.status,
      label: listFilterTexts.statusLabel,
      allOptionsLabel: listFilterTexts.allStatusesOptionLabel,
      options: createListFilterOptionsFromLabels(
        routeStatusLabels,
        RouteStatus
      ),
    },
    {
      kind: ListFilterFieldKind.Select,
      name: listFilterSearchParamNames.driverId,
      label: "Водій",
      allOptionsLabel: "Усі водії",
      options: driverLookupOptions.map((driverLookupOption) => ({
        value: String(driverLookupOption.id),
        label: formatDriverFullName(driverLookupOption),
      })),
    },
    {
      kind: ListFilterFieldKind.Select,
      name: listFilterSearchParamNames.autoId,
      label: "Автомобіль",
      allOptionsLabel: "Усі автомобілі",
      options: autoLookupOptions.map((autoLookupOption) => ({
        value: String(autoLookupOption.id),
        label: formatAutoTitleWithNumber(autoLookupOption),
      })),
    },
    createDepotListFilterField(depots),
    createListSearchFilterField("ID маршруту, місто або країна"),
  ]
}
