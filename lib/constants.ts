import { CheckCircle, Play, XCircle } from "lucide-react"
import { AuditAction } from "@/lib/types/audit-action"
import { AuditLogSortField } from "@/lib/types/audit-log-sort-field"
import { AutoSortField } from "@/lib/types/auto-sort-field"
import { AutoStatus } from "@/lib/types/auto-status"
import { BadgeTone } from "@/lib/types/badge-tone"
import { DispatcherSortField } from "@/lib/types/dispatcher-sort-field"
import { DriverFormField } from "@/lib/types/driver-form-field"
import { DriverSortField } from "@/lib/types/driver-sort-field"
import { LocationSortField } from "@/lib/types/location-sort-field"
import { LoginRedirectReason } from "@/lib/types/login-redirect-reason"
import { NavigationLink } from "@/lib/types/navigation-link"
import { RouteSortField } from "@/lib/types/route-sort-field"
import { RouteStatus } from "@/lib/types/route-status"
import { RouteStatusAction } from "@/lib/types/route-status-action"
import { RoutesPeriodFormValues } from "@/lib/types/routes-period-form-values"
import { SortDirection } from "@/lib/types/sort-direction"
import { SortOption } from "@/lib/types/sort-option"
import { TableColumn } from "@/lib/types/table-column"
import { UserRole } from "@/lib/types/user-role"

export const cookieNames = Object.freeze({
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  singleSignOnTransaction: "singleSignOnTransaction",
})

export const bffRoutes = Object.freeze({
  sessionLogin: "/api/session/login",
  sessionLogout: "/api/session/logout",
  sessionChangePassword: "/api/session/change-password",
  sessionPrefix: "/api/session/",
  singleSignOnStart: "/api/session/sso/start",
  singleSignOnCallback: "/api/session/sso/callback",
  apiProxy: "/api/proxy",
})

export const singleSignOnSettingsEnvironmentVariableNames = Object.freeze({
  authority: "OIDC_AUTHORITY",
  clientId: "OIDC_CLIENT_ID",
  clientSecret: "OIDC_CLIENT_SECRET",
  appBaseUrl: "APP_BASE_URL",
})

export const openIdConnectProtocolValues = Object.freeze({
  metadataPath: "/.well-known/openid-configuration",
  responseTypeCode: "code",
  responseModeQuery: "query",
  scope: "openid profile email",
  codeChallengeMethod: "S256",
  grantTypeAuthorizationCode: "authorization_code",
  discoveryCacheSeconds: 3600,
  transactionCookieMaxAgeSeconds: 10 * 60,
  randomValueByteLength: 32,
})

export const sessionRefreshSettings = Object.freeze({
  accessTokenRefreshLeadMilliseconds: 30 * 1000,
})

export const accountPasswordConstraints = Object.freeze({
  minLength: 12,
  maxLength: 100,
  digitPattern: /[0-9]/,
  uppercaseLetterPattern: /[A-Z]/,
  lowercaseLetterPattern: /[a-z]/,
})

export const passwordPolicyMessages = Object.freeze({
  tooShort: `Пароль має містити щонайменше ${accountPasswordConstraints.minLength} символів.`,
  tooLong: `Пароль не може перевищувати ${accountPasswordConstraints.maxLength} символів.`,
  digitMissing: "Пароль має містити щонайменше одну цифру.",
  uppercaseLetterMissing:
    "Пароль має містити щонайменше одну велику латинську літеру.",
  lowercaseLetterMissing:
    "Пароль має містити щонайменше одну малу латинську літеру.",
  confirmationMismatch: "Паролі не збігаються.",
  hint: `Мінімум ${accountPasswordConstraints.minLength} символів, велика й мала латинські літери та цифра`,
})

export const apiProblemTypes = Object.freeze({
  passwordChangeRequired: "passwordChangeRequired",
  externalIdentityAccessDenied: "externalIdentityAccessDenied",
  concurrencyConflict: "concurrencyConflict",
})

export const httpHeaderNames = Object.freeze({
  authorization: "Authorization",
  contentType: "Content-Type",
  origin: "Origin",
  host: "Host",
  forwardedFor: "X-Forwarded-For",
})

export const httpStatusCodes = Object.freeze({
  noContent: 204,
  notModified: 304,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  serviceUnavailable: 503,
})

export const bffErrorMessages = Object.freeze({
  crossOriginRequestRejected: "Запит з іншого джерела відхилено.",
  invalidRequestBody: "Некоректні дані запиту.",
  unsupportedApiPath: "Запитаний шлях API не підтримується.",
  logoutFailed: "Не вдалося вийти з системи. Спробуйте ще раз.",
  singleSignOnNotConfigured:
    "Вхід через корпоративний обліковий запис не налаштовано.",
})

export const backendApiPathPrefixSegment = "api"

export const httpContentTypes = Object.freeze({
  json: "application/json",
  problemJson: "application/problem+json",
  formUrlEncoded: "application/x-www-form-urlencoded",
})

export const browserStorageKeys = Object.freeze({
  listFilterPanelState: "listFilterPanelState",
})

export const browserEventNames = Object.freeze({
  browserStorageChange: "browserStorageChange",
})

export const floatingPanelDimensions = Object.freeze({
  visibleEdgePixels: 64,
})

export const jwtClaimNames = Object.freeze({
  role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  shortRole: "role",
  userName: "unique_name",
  expirationTime: "exp",
})

export const timeUnitConversions = Object.freeze({
  millisecondsPerSecond: 1000,
})

export const loginSearchParamNames = Object.freeze({
  returnUrl: "returnUrl",
  reason: "reason",
})

export const commonUiTexts = Object.freeze({
  sessionExpiredMessage: "Сесія завершилась. Увійдіть у систему повторно.",
  serverUnavailableMessage: "Сервер недоступний. Спробуйте пізніше.",
  concurrencyConflictMessage:
    "Запис змінив інший користувач. Дані на сторінці оновлено — перевірте їх і повторіть дію.",
  nothingFoundMessage: "Нічого не знайдено за вашим запитом.",
  errorPageTitle: "Щось пішло не так",
  retryButtonLabel: "Спробувати ще",
  homeLinkLabel: "На головну",
  closeButtonLabel: "Закрити",
  deletedUserLabel: "Видалений користувач",
  unexpectedApiResponseFormatMessage:
    "Сервер повернув дані в неочікуваному форматі.",
})

export const openIdConnectAuthorizationResponseParamNames = Object.freeze({
  code: "code",
  state: "state",
  error: "error",
})

export const loginRedirectReasonMessages: Readonly<
  Record<LoginRedirectReason, string>
> = Object.freeze({
  [LoginRedirectReason.SessionExpired]: commonUiTexts.sessionExpiredMessage,
  [LoginRedirectReason.SingleSignOnFailed]:
    "Не вдалося увійти через корпоративний обліковий запис. Спробуйте ще раз.",
  [LoginRedirectReason.SingleSignOnAccessDenied]:
    "Ваш корпоративний обліковий запис не має доступу до системи. Зверніться до адміністратора.",
})

export const userRoleLabels: Readonly<Record<UserRole, string>> = Object.freeze(
  {
    [UserRole.Admin]: "Адміністратор",
    [UserRole.Dispatcher]: "Диспетчер",
  }
)

export const localeCodes = Object.freeze({
  display: "uk-UA",
})

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
  refreshSession: "/api/Account/refreshSession",
  logout: "/api/Account/logout",
  changePassword: "/api/Account/changePassword",
  resetUserPassword: "/api/Account/resetUserPassword",
  loginWithExternalIdentity: "/api/Account/loginWithExternalIdentity",
  registerAccount: "/api/Account/registerAccount",
  dispatchersPagedList: "/api/Account/getDispatchersPagedList",
  deleteUser: "/api/Account/deleteUser",
  createAuto: "/api/Auto/createAuto",
  updateAuto: "/api/Auto/updateAuto",
  deleteAuto: "/api/Auto/deleteAuto",
  autosPagedList: "/api/Auto/getAutosPagedList",
  autoLookupOptions: "/api/Auto/getAutoLookupOptions",
  createDriver: "/api/Driver/createDriver",
  updateDriver: "/api/Driver/updateDriver",
  deleteDriver: "/api/Driver/deleteDriver",
  driversPagedList: "/api/Driver/getDriversPagedList",
  driverLookupOptions: "/api/Driver/getDriverLookupOptions",
  createLocation: "/api/Location/createLocation",
  deleteLocation: "/api/Location/deleteLocation",
  locationsPagedList: "/api/Location/getLocationsPagedList",
  locationLookupOptions: "/api/Location/getLocationLookupOptions",
  createRoute: "/api/Route/createRoute",
  updateRoute: "/api/Route/updateRoute",
  deleteRoute: "/api/Route/deleteRoute",
  routesPagedList: "/api/Route/getRoutesPagedList",
  routesPeriodReport: "/api/Route/getRoutesPeriodReport",
  createAutoMaintenance: "/api/AutoMaintenance/createAutoMaintenance",
  updateAutoMaintenance: "/api/AutoMaintenance/updateAutoMaintenance",
  autoMaintenancesByAutoId: "/api/AutoMaintenance/getAutoMaintenancesByAutoId",
  auditLogsPagedList: "/api/AuditLog/getAuditLogsPagedList",
  dashboardSummary: "/api/Dashboard/getDashboardSummary",
})

export const listSearchParamNames = Object.freeze({
  page: "page",
  pageSize: "pageSize",
  sort: "sort",
  sortDirection: "sortDirection",
  search: "search",
})

export const listFilterSearchParamNames = Object.freeze({
  status: "status",
  color: "color",
  country: "country",
  action: "action",
  timeFromDate: "timeFromDate",
  timeToDate: "timeToDate",
  startCity: "startCity",
  destinationCity: "destinationCity",
  departureFromDate: "departureFromDate",
  departureToDate: "departureToDate",
  driverId: "driverId",
  autoId: "autoId",
})

export const routesPeriodSearchParamNames: Readonly<{
  [TRoutesPeriodFormField in keyof RoutesPeriodFormValues]: TRoutesPeriodFormField
}> = Object.freeze({
  periodStartDate: "periodStartDate",
  periodEndDate: "periodEndDate",
})

export const listPaging = Object.freeze({
  firstPage: 1,
  defaultPageSize: 20,
  pageSizeOptions: Object.freeze([10, 20, 50, 100]),
})

export const listFilterTexts = Object.freeze({
  statusLabel: "Статус",
  allStatusesOptionLabel: "Усі статуси",
})

export const routesPageTexts = Object.freeze({
  title: "Маршрути",
  description:
    "Перегляд доступних маршрутів із деталями відправлення, прибуття, автомобіля та водія.",
})

export const recentRoutesBlockSettings = Object.freeze({
  routesCount: 5,
})

export const routesPeriodPresetSettings = Object.freeze({
  lastWeekDaysCount: 7,
})

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

export const iconActionLabels = Object.freeze({
  edit: "Редагувати",
  delete: "Видалити",
  maintenance: "Технічне обслуговування",
  resetPassword: "Скинути пароль",
  viewOnMap: "Показати маршрут на карті",
})

export const routeFormSelectTexts = Object.freeze({
  startLocationPlaceholder: "Оберіть початкову локацію",
  destinationLocationPlaceholder: "Оберіть кінцеву локацію",
  locationSearchPlaceholder: "Пошук міста або країни...",
  locationEmptyMessage: "Локацію не знайдено",
  driverPlaceholder: "Оберіть водія",
  driverSearchPlaceholder: "Пошук за ПІБ або посвідченням...",
  driverEmptyMessage: "Водія не знайдено",
  autoPlaceholder: "Оберіть авто",
  autoSearchPlaceholder: "Пошук за маркою або номером...",
  autoEmptyMessage: "Автомобіль не знайдено",
})

export const routeFormValidationMessages = Object.freeze({
  requiredFieldsMissing:
    "Будь ласка, заповніть всі поля форми перед збереженням.",
  sameStartAndDestinationLocation:
    "Початкова та кінцева локації мають відрізнятися.",
  arrivalNotAfterDeparture:
    "Час прибуття має бути пізніше за час відправлення.",
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

export const routeStatusBadgeClassNames: Readonly<Record<RouteStatus, string>> =
  Object.freeze({
    [RouteStatus.Planned]: "bg-indigo-50 text-indigo-700 ring-indigo-700/15",
    [RouteStatus.InProgress]: "bg-blue-50 text-blue-700 ring-blue-700/15",
    [RouteStatus.Completed]: "bg-green-50 text-green-700 ring-green-700/15",
    [RouteStatus.Cancelled]: "bg-slate-100 text-slate-600 ring-slate-600/15",
  })

export const badgeToneClassNames: Readonly<Record<BadgeTone, string>> =
  Object.freeze({
    [BadgeTone.Neutral]: "bg-slate-100 text-slate-700 ring-slate-700/10",
    [BadgeTone.Info]: "bg-blue-50 text-blue-700 ring-blue-700/10",
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
      variant: "accent",
    },
    {
      targetRouteStatus: RouteStatus.Completed,
      label: "Завершити",
      icon: CheckCircle,
      variant: "success",
    },
    {
      targetRouteStatus: RouteStatus.Cancelled,
      label: "Скасувати",
      icon: XCircle,
      variant: "warning",
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
    [AuditAction.UserPasswordReset]: "Скинуто пароль користувача",
    [AuditAction.UserPasswordChanged]: "Користувач змінив пароль",
    [AuditAction.UserProvisioned]: "Створено користувача через корпоративний вхід",
  })
