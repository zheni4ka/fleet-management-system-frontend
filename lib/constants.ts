import { CheckCircle, Play, XCircle } from "lucide-react"
import { AuditAction } from "@/lib/types/audit-action"
import { AutoStatus } from "@/lib/types/auto-status"
import { DriverFormField } from "@/lib/types/driver-form-field"
import { NavigationLink } from "@/lib/types/navigation-link"
import { RouteStatus } from "@/lib/types/route-status"
import { RouteStatusAction } from "@/lib/types/route-status-action"
import { TableColumn } from "@/lib/types/table-column"

export const cookieNames = Object.freeze({
  authToken: "token",
})

export const authCookieMaxAgeSeconds = 24 * 60 * 60

export const jwtClaimNames = Object.freeze({
  role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  shortRole: "role",
})

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
  allAccounts: "/api/Account/all",
  autos: "/api/Auto",
  allAutos: "/api/Auto/all",
  drivers: "/api/Driver",
  allDrivers: "/api/Driver/all",
  routes: "/api/Route",
  allRoutes: "/api/Route/all",
  locations: "/api/Location",
  allLocations: "/api/Location/all",
  routesSearch: "/api/Route/search",
  routesPeriodReport: "/api/Route/periodReport",
  allAuditLogs: "/api/AuditLog/all",
  autoMaintenance: "/api/AutoMaintenance",
  autoMaintenanceByAuto: "/api/AutoMaintenance/auto",
})

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

export const autosTableColumns: ReadonlyArray<TableColumn> = Object.freeze([
  { label: "ID", className: "w-1/12" },
  { label: "Марка", className: "w-1/6" },
  { label: "Модель", className: "w-1/6" },
  { label: "Колір", className: "w-1/6" },
  { label: "Статус", className: "w-1/6" },
  { label: "Номер", className: "w-1/6" },
  { label: "Операції", className: "w-1/6 text-center" },
])

export const driversTableColumns: ReadonlyArray<TableColumn> = Object.freeze([
  { label: "ID", className: "w-1/6" },
  { label: "Ім'я", className: "w-1/6" },
  { label: "Прізвище", className: "w-1/6" },
  { label: "По батькові", className: "w-1/6" },
  { label: "Посвідчення водія", className: "w-1/6" },
  { label: "Операції", className: "w-1/6 text-center" },
])

export const dispatchersTableColumns: ReadonlyArray<TableColumn> =
  Object.freeze([
    { label: "ID", className: "w-1/4" },
    { label: "Логін", className: "w-1/4" },
    { label: "Email", className: "w-1/4" },
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

export const locationsTableColumns: ReadonlyArray<TableColumn> = Object.freeze([
  { label: "ID", className: "w-1/6" },
  { label: "Місто", className: "w-1/3" },
  { label: "Країна", className: "w-1/3" },
  { label: "Операції", className: "w-1/6 text-center" },
])

export const auditLogsTableColumns: ReadonlyArray<TableColumn> = Object.freeze([
  { label: "Час", className: "w-1/5" },
  { label: "Дія", className: "w-2/5" },
  { label: "Користувач", className: "w-1/5" },
  { label: "ID об'єкта", className: "w-1/5" },
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
