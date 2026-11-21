import {
  autoColorOptions,
  archivedRecordsFilterValue,
  listFilterSearchParamNames,
  listSearchParamNames,
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
  MessageTranslator,
  RouteStatus,
  SelectListFilterField,
  TextListFilterField,
} from "@/lib/types"

function createListSearchFilterField(
  translateMessage: MessageTranslator,
  placeholderMessageKey: string
): TextListFilterField {
  return {
    kind: ListFilterFieldKind.Text,
    name: listSearchParamNames.search,
    label: translateMessage("listFilters.searchLabel"),
    placeholder: translateMessage(`listFilters.${placeholderMessageKey}`),
  }
}

function createArchiveStateListFilterField(
  translateMessage: MessageTranslator
): SelectListFilterField {
  return {
    kind: ListFilterFieldKind.Select,
    name: listFilterSearchParamNames.isArchived,
    label: translateMessage("listFilters.archiveStateLabel"),
    allOptionsLabel: translateMessage("listFilters.activeRecordsOptionLabel"),
    options: [
      {
        value: archivedRecordsFilterValue,
        label: translateMessage("listFilters.archivedRecordsOptionLabel"),
      },
    ],
  }
}

function createDepotListFilterField(
  depots: ReadonlyArray<Depot>,
  translateMessage: MessageTranslator
): SelectListFilterField {
  return {
    kind: ListFilterFieldKind.Select,
    name: listFilterSearchParamNames.depotId,
    label: translateMessage("listFilters.depotLabel"),
    allOptionsLabel: translateMessage("listFilters.allDepotsOptionLabel"),
    options: depots.map((depot) => ({
      value: String(depot.id),
      label: depot.name,
    })),
  }
}

function createTranslatedEnumListFilterOptions<TEnumValue extends string>(
  enumObject: Record<string, TEnumValue>,
  enumMessageNamespace: string,
  translateMessage: MessageTranslator
): ReadonlyArray<ListFilterOption> {
  return Object.values(enumObject).map((enumValue) => ({
    value: enumValue,
    label: translateMessage(`${enumMessageNamespace}.${enumValue}`),
  }))
}

export function createAutosListFilterFields(
  depots: ReadonlyArray<Depot>,
  translateMessage: MessageTranslator
): ReadonlyArray<ListFilterField> {
  return [
    createListSearchFilterField(translateMessage, "autoSearchPlaceholder"),
    {
      kind: ListFilterFieldKind.Select,
      name: listFilterSearchParamNames.status,
      label: translateMessage("listFilters.statusLabel"),
      allOptionsLabel: translateMessage("listFilters.allStatusesOptionLabel"),
      options: createTranslatedEnumListFilterOptions(
        AutoStatus,
        "autoStatus",
        translateMessage
      ),
    },
    {
      kind: ListFilterFieldKind.Select,
      name: listFilterSearchParamNames.color,
      label: translateMessage("listFilters.colorLabel"),
      allOptionsLabel: translateMessage("listFilters.allColorsOptionLabel"),
      options: autoColorOptions.map((autoColor) => ({
        value: autoColor,
        label: autoColor,
      })),
    },
    createDepotListFilterField(depots, translateMessage),
    createArchiveStateListFilterField(translateMessage),
  ]
}

export function createDriversListFilterFields(
  depots: ReadonlyArray<Depot>,
  translateMessage: MessageTranslator
): ReadonlyArray<ListFilterField> {
  return [
    createListSearchFilterField(translateMessage, "driverSearchPlaceholder"),
    createDepotListFilterField(depots, translateMessage),
    createArchiveStateListFilterField(translateMessage),
  ]
}

export function createDispatchersListFilterFields(
  translateMessage: MessageTranslator
): ReadonlyArray<ListFilterField> {
  return [
    createListSearchFilterField(
      translateMessage,
      "dispatcherSearchPlaceholder"
    ),
  ]
}

export function createAuditLogsListFilterFields(
  translateMessage: MessageTranslator
): ReadonlyArray<ListFilterField> {
  return [
    createListSearchFilterField(translateMessage, "auditLogSearchPlaceholder"),
    {
      kind: ListFilterFieldKind.Select,
      name: listFilterSearchParamNames.action,
      label: translateMessage("listFilters.actionLabel"),
      allOptionsLabel: translateMessage("listFilters.allActionsOptionLabel"),
      options: createTranslatedEnumListFilterOptions(
        AuditAction,
        "auditAction",
        translateMessage
      ),
    },
    {
      kind: ListFilterFieldKind.Date,
      name: listFilterSearchParamNames.timeFromDate,
      label: translateMessage("listFilters.dateFromLabel"),
    },
    {
      kind: ListFilterFieldKind.Date,
      name: listFilterSearchParamNames.timeToDate,
      label: translateMessage("listFilters.dateToLabel"),
      rangeStartFieldName: listFilterSearchParamNames.timeFromDate,
    },
  ]
}

export function createRoutesListFilterFields(
  autoLookupOptions: ReadonlyArray<AutoLookupOption>,
  driverLookupOptions: ReadonlyArray<DriverLookupOption>,
  depots: ReadonlyArray<Depot>,
  translateMessage: MessageTranslator
): ReadonlyArray<ListFilterField> {
  return [
    {
      kind: ListFilterFieldKind.Text,
      name: listFilterSearchParamNames.startCity,
      label: translateMessage("listFilters.startCityLabel"),
      placeholder: "",
    },
    {
      kind: ListFilterFieldKind.Text,
      name: listFilterSearchParamNames.destinationCity,
      label: translateMessage("listFilters.destinationCityLabel"),
      placeholder: "",
    },
    {
      kind: ListFilterFieldKind.Date,
      name: listFilterSearchParamNames.departureFromDate,
      label: translateMessage("listFilters.departureFromLabel"),
    },
    {
      kind: ListFilterFieldKind.Date,
      name: listFilterSearchParamNames.departureToDate,
      label: translateMessage("listFilters.departureToLabel"),
      rangeStartFieldName: listFilterSearchParamNames.departureFromDate,
    },
    {
      kind: ListFilterFieldKind.Select,
      name: listFilterSearchParamNames.status,
      label: translateMessage("listFilters.statusLabel"),
      allOptionsLabel: translateMessage("listFilters.allStatusesOptionLabel"),
      options: createTranslatedEnumListFilterOptions(
        RouteStatus,
        "routeStatus",
        translateMessage
      ),
    },
    {
      kind: ListFilterFieldKind.Select,
      name: listFilterSearchParamNames.driverId,
      label: translateMessage("listFilters.driverLabel"),
      allOptionsLabel: translateMessage("listFilters.allDriversOptionLabel"),
      options: driverLookupOptions.map((driverLookupOption) => ({
        value: String(driverLookupOption.id),
        label: formatDriverFullName(driverLookupOption),
      })),
    },
    {
      kind: ListFilterFieldKind.Select,
      name: listFilterSearchParamNames.autoId,
      label: translateMessage("listFilters.autoLabel"),
      allOptionsLabel: translateMessage("listFilters.allAutosOptionLabel"),
      options: autoLookupOptions.map((autoLookupOption) => ({
        value: String(autoLookupOption.id),
        label: formatAutoTitleWithNumber(autoLookupOption),
      })),
    },
    createDepotListFilterField(depots, translateMessage),
    createListSearchFilterField(translateMessage, "routeSearchPlaceholder"),
  ]
}
