import { CheckCircle, Play, XCircle } from "lucide-react"
import { AuditAction } from "@/lib/types/audit-action"
import { AuditLogSortField } from "@/lib/types/audit-log-sort-field"
import { AutoSortField } from "@/lib/types/auto-sort-field"
import { AutoStatus } from "@/lib/types/auto-status"
import { DispatcherSortField } from "@/lib/types/dispatcher-sort-field"
import { DriverFormField } from "@/lib/types/driver-form-field"
import { DriverSortField } from "@/lib/types/driver-sort-field"
import { LocationSortField } from "@/lib/types/location-sort-field"
import { NavigationLink } from "@/lib/types/navigation-link"
import { RouteSortField } from "@/lib/types/route-sort-field"
import { RouteStatus } from "@/lib/types/route-status"
import { RouteStatusAction } from "@/lib/types/route-status-action"
import { SortDirection } from "@/lib/types/sort-direction"
import { SortOption } from "@/lib/types/sort-option"
import { TableColumn } from "@/lib/types/table-column"
import { UserRole } from "@/lib/types/user-role"

export const cookieNames = Object.freeze({
  authToken: "token",
})

export const browserStorageKeys = Object.freeze({
  listFilterPanelState: "listFilterPanelState",
})

export const browserStorageChangeEventName = "browserStorageChange"

export const floatingPanelVisibleEdgePixels = 64

export const authCookieMaxAgeSeconds = 24 * 60 * 60

export const jwtClaimNames = Object.freeze({
  role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  shortRole: "role",
  userName: "unique_name",
  expirationTime: "exp",
})

export const millisecondsPerSecond = 1000

export const loginSearchParamNames = Object.freeze({
  returnUrl: "returnUrl",
  reason: "reason",
})

export const sessionExpiredMessage =
  "Сесія завершилась. Увійдіть у систему повторно."

export const userRoleLabels: Readonly<Record<UserRole, string>> = Object.freeze(
  {
    [UserRole.Admin]: "Адміністратор",
    [UserRole.Dispatcher]: "Диспетчер",
  }
)

export const displayLocale = "uk-UA"

export const appRoutes = Object.freeze({
  home: "/",
  login: "/login",
  autos: "/auto",
  drivers: "/driver",
  dispatchers: "/dispatcher",
  routes: "/route",
  locations: "/location",
  reports: "/report",
  auditLogs: "/audit-log",
})

export const apiEndpoints = Object.freeze({
  login: "/api/Account/login",
  registerAccount: "/api/Account/register",
  accounts: "/api/Account",
  autos: "/api/Auto",
  allAutos: "/api/Auto/all",
  drivers: "/api/Driver",
  allDrivers: "/api/Driver/all",
  routes: "/api/Route",
  allRoutes: "/api/Route/all",
  locations: "/api/Location",
  allLocations: "/api/Location/all",
  routesPeriodReport: "/api/Route/periodReport",
  autoMaintenance: "/api/AutoMaintenance",
  autoMaintenanceByAuto: "/api/AutoMaintenance/auto",
  autosPagedList: "/api/Auto/pagedList",
  driversPagedList: "/api/Driver/pagedList",
  locationsPagedList: "/api/Location/pagedList",
  dispatchersPagedList: "/api/Account/dispatchersPagedList",
  routesPagedList: "/api/Route/pagedList",
  auditLogsPagedList: "/api/AuditLog/pagedList",
})

export const listSearchParamNames = Object.freeze({
  page: "page",
  pageSize: "pageSize",
  sort: "sort",
  sortDirection: "sortDirection",
  search: "search",
})

export const firstListPage = 1

export const defaultListPageSize = 20

export const listPageSizeOptions: ReadonlyArray<number> = Object.freeze([
  10, 20, 50, 100,
])

export const sortDirectionLabels: Readonly<Record<SortDirection, string>> =
  Object.freeze({
    [SortDirection.Ascending]: "За зростанням",
    [SortDirection.Descending]: "За спаданням",
  })

export const routeSortOptions: ReadonlyArray<SortOption<RouteSortField>> =
  Object.freeze([
    { sortField: RouteSortField.DepartureTime, label: "Час відправлення" },
    { sortField: RouteSortField.ArrivalTime, label: "Час прибуття" },
    { sortField: RouteSortField.Status, label: "Статус" },
    { sortField: RouteSortField.Id, label: "ID" },
  ])

export const nothingFoundMessage = "Нічого не знайдено за вашим запитом."

export const autoStatusLabels: Readonly<Record<AutoStatus, string>> =
  Object.freeze({
    [AutoStatus.Available]: "Доступне",
    [AutoStatus.InService]: "В експлуатації",
    [AutoStatus.UnderMaintenance]: "На техобслуговуванні",
  })

export const routeStatusLabels: Readonly<Record<RouteStatus, string>> =
  Object.freeze({
    [RouteStatus.Planned]: "Заплановано",
    [RouteStatus.InProgress]: "В процесі",
    [RouteStatus.Completed]: "Виконано",
    [RouteStatus.Cancelled]: "Скасовано",
  })

export const activeRouteStatuses: ReadonlyArray<RouteStatus> = Object.freeze([
  RouteStatus.Planned,
  RouteStatus.InProgress,
])

export const allowedRouteStatusTransitions: Readonly<
  Record<RouteStatus, ReadonlyArray<RouteStatus>>
> = Object.freeze({
  [RouteStatus.Planned]: [RouteStatus.InProgress, RouteStatus.Cancelled],
  [RouteStatus.InProgress]: [RouteStatus.Completed, RouteStatus.Cancelled],
  [RouteStatus.Completed]: [],
  [RouteStatus.Cancelled]: [],
})

export const autoColorOptions: ReadonlyArray<string> = Object.freeze([
  "Червоний",
  "Синій",
  "Зелений",
  "Чорний",
  "Білий",
  "Сірий",
  "Жовтий",
])

export const unknownLocationLabel = "Невідома"

export const headerNavigationLinks: ReadonlyArray<NavigationLink> =
  Object.freeze([
    { href: appRoutes.drivers, label: "Водії", isAdminOnly: true },
    { href: appRoutes.autos, label: "Авто", isAdminOnly: true },
    { href: appRoutes.dispatchers, label: "Диспетчери", isAdminOnly: true },
    { href: appRoutes.routes, label: "Маршрути", isAdminOnly: false },
    { href: appRoutes.locations, label: "Локації", isAdminOnly: true },
    { href: appRoutes.reports, label: "Звіти", isAdminOnly: false },
    { href: appRoutes.auditLogs, label: "Журнал дій", isAdminOnly: true },
  ])

export const fastAccessNavigationLinks: ReadonlyArray<NavigationLink> =
  Object.freeze([
    { href: appRoutes.drivers, label: "База водіїв", isAdminOnly: true },
    { href: appRoutes.autos, label: "Облік автомобілів", isAdminOnly: true },
    {
      href: appRoutes.routes,
      label: "Логістика маршрутів",
      isAdminOnly: false,
    },
    {
      href: appRoutes.reports,
      label: "Звіти за період",
      isAdminOnly: false,
    },
  ])

export const autosTableColumns: ReadonlyArray<TableColumn<AutoSortField>> =
  Object.freeze([
    { label: "ID", className: "w-1/12", sortField: AutoSortField.Id },
    { label: "Марка", className: "w-1/6", sortField: AutoSortField.Mark },
    { label: "Модель", className: "w-1/6", sortField: AutoSortField.Model },
    { label: "Колір", className: "w-1/6", sortField: AutoSortField.Color },
    { label: "Статус", className: "w-1/6", sortField: AutoSortField.Status },
    { label: "Номер", className: "w-1/6", sortField: AutoSortField.Number },
    { label: "Операції", className: "w-1/6 text-center" },
  ])

export const driversTableColumns: ReadonlyArray<TableColumn<DriverSortField>> =
  Object.freeze([
    { label: "ID", className: "w-1/6", sortField: DriverSortField.Id },
    { label: "Ім'я", className: "w-1/6", sortField: DriverSortField.Name },
    {
      label: "Прізвище",
      className: "w-1/6",
      sortField: DriverSortField.Surname,
    },
    {
      label: "По батькові",
      className: "w-1/6",
      sortField: DriverSortField.Patronymic,
    },
    {
      label: "Посвідчення водія",
      className: "w-1/6",
      sortField: DriverSortField.LicenseNumber,
    },
    { label: "Операції", className: "w-1/6 text-center" },
  ])

export const dispatchersTableColumns: ReadonlyArray<
  TableColumn<DispatcherSortField>
> = Object.freeze([
  { label: "ID", className: "w-1/4", sortField: DispatcherSortField.Id },
  {
    label: "Логін",
    className: "w-1/4",
    sortField: DispatcherSortField.Username,
  },
  { label: "Email", className: "w-1/4", sortField: DispatcherSortField.Email },
  { label: "Операції", className: "w-1/4 text-center" },
])

export const recentRoutesTableColumns: ReadonlyArray<TableColumn> =
  Object.freeze([
    { label: "ID", className: "w-1/6" },
    { label: "Звідки → Куди", className: "w-2/6" },
    { label: "Відправлення", className: "w-1/6" },
    { label: "Прибуття", className: "w-1/6" },
    { label: "Статус", className: "w-1/6 text-right" },
  ])

export const driverFormFields: ReadonlyArray<DriverFormField> = Object.freeze([
  { name: "name", label: "Ім'я" },
  { name: "surname", label: "Прізвище" },
  { name: "patronymic", label: "По батькові" },
  { name: "licenseNumber", label: "Посвідчення водія" },
])

export const routeStatusActions: ReadonlyArray<RouteStatusAction> =
  Object.freeze([
    {
      targetRouteStatus: RouteStatus.InProgress,
      label: "Розпочати",
      icon: Play,
      className: "bg-blue-600 text-white hover:bg-blue-700",
    },
    {
      targetRouteStatus: RouteStatus.Completed,
      label: "Завершити",
      icon: CheckCircle,
      className: "bg-green-600 text-white hover:bg-green-700",
    },
    {
      targetRouteStatus: RouteStatus.Cancelled,
      label: "Скасувати",
      icon: XCircle,
      className: "border border-orange-200 text-orange-600 hover:bg-orange-50",
    },
  ])

export const locationsTableColumns: ReadonlyArray<
  TableColumn<LocationSortField>
> = Object.freeze([
  { label: "ID", className: "w-1/6", sortField: LocationSortField.Id },
  { label: "Місто", className: "w-1/3", sortField: LocationSortField.City },
  { label: "Країна", className: "w-1/3", sortField: LocationSortField.Country },
  { label: "Операції", className: "w-1/6 text-center" },
])

export const auditLogsTableColumns: ReadonlyArray<
  TableColumn<AuditLogSortField>
> = Object.freeze([
  { label: "Час", className: "w-1/5", sortField: AuditLogSortField.Time },
  { label: "Дія", className: "w-2/5", sortField: AuditLogSortField.Action },
  {
    label: "Користувач",
    className: "w-1/5",
    sortField: AuditLogSortField.DispatcherUsername,
  },
  {
    label: "ID об'єкта",
    className: "w-1/5",
    sortField: AuditLogSortField.EntityId,
  },
])

export const reportDriverSummariesTableColumns: ReadonlyArray<TableColumn> =
  Object.freeze([
    { label: "Водій", className: "w-2/5" },
    { label: "Усього рейсів", className: "w-1/5 text-center" },
    { label: "Виконано", className: "w-1/5 text-center" },
    { label: "Годин у дорозі", className: "w-1/5 text-center" },
  ])

export const reportRoutesTableColumns: ReadonlyArray<TableColumn> =
  Object.freeze([
    { label: "ID", className: "w-1/12" },
    { label: "Звідки → Куди", className: "w-3/12" },
    { label: "Відправлення", className: "w-2/12" },
    { label: "Прибуття", className: "w-2/12" },
    { label: "Водій", className: "w-2/12" },
    { label: "Статус", className: "w-2/12 text-right" },
  ])

export const deletedUserLabel = "Видалений користувач"

export const auditActionLabels: Readonly<Record<AuditAction, string>> =
  Object.freeze({
    [AuditAction.RouteCreated]: "Створено маршрут",
    [AuditAction.RouteUpdated]: "Змінено маршрут",
    [AuditAction.RouteDeleted]: "Видалено маршрут",
    [AuditAction.AutoCreated]: "Додано автомобіль",
    [AuditAction.AutoUpdated]: "Змінено автомобіль",
    [AuditAction.AutoStatusChanged]: "Змінено статус автомобіля",
    [AuditAction.AutoDeleted]: "Видалено автомобіль",
    [AuditAction.DriverCreated]: "Додано водія",
    [AuditAction.DriverUpdated]: "Змінено водія",
    [AuditAction.DriverDeleted]: "Видалено водія",
    [AuditAction.LocationCreated]: "Додано локацію",
    [AuditAction.LocationDeleted]: "Видалено локацію",
    [AuditAction.MaintenanceCreated]: "Створено техобслуговування",
    [AuditAction.MaintenanceUpdated]: "Змінено техобслуговування",
    [AuditAction.MaintenanceDeleted]: "Видалено техобслуговування",
    [AuditAction.UserRegistered]: "Зареєстровано користувача",
    [AuditAction.UserDeleted]: "Видалено користувача",
  })
