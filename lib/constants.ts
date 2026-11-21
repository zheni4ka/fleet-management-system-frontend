import { CheckCircle, Play, XCircle } from "lucide-react"
import type { ToastPosition } from "react-hot-toast"
import { AppLocale } from "@/lib/types/app-locale"
import { AuditLogSortField } from "@/lib/types/audit-log-sort-field"
import { AutoSortField } from "@/lib/types/auto-sort-field"
import { BadgeTone } from "@/lib/types/badge-tone"
import { DispatcherSortField } from "@/lib/types/dispatcher-sort-field"
import { DriverFormField } from "@/lib/types/driver-form-field"
import { DriverSortField } from "@/lib/types/driver-sort-field"
import { NavigationLink } from "@/lib/types/navigation-link"
import { RouteSortField } from "@/lib/types/route-sort-field"
import { RouteStatus } from "@/lib/types/route-status"
import { RouteStatusAction } from "@/lib/types/route-status-action"
import { RoutesPeriodFormValues } from "@/lib/types/routes-period-form-values"
import { SortOption } from "@/lib/types/sort-option"
import { TableColumn } from "@/lib/types/table-column"

export const cookieNames = Object.freeze({
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  singleSignOnTransaction: "singleSignOnTransaction",
  locale: "NEXT_LOCALE",
})

export const bffRoutes = Object.freeze({
  sessionLogin: "/api/session/login",
  sessionLogout: "/api/session/logout",
  sessionChangePassword: "/api/session/change-password",
  sessionLanguage: "/api/session/language",
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
  traceparent: "traceparent",
  acceptLanguage: "Accept-Language",
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

export const openIdConnectAuthorizationResponseParamNames = Object.freeze({
  code: "code",
  state: "state",
  error: "error",
})

export const appRoutes = Object.freeze({
  home: "/",
  login: "/login",
  autos: "/auto",
  drivers: "/driver",
  dispatchers: "/dispatcher",
  routes: "/route",
  reports: "/report",
  auditLogs: "/audit-log",
  depots: "/depot",
})

export const apiEndpoints = Object.freeze({
  login: "/api/v1/Account/login",
  refreshSession: "/api/v1/Account/refreshSession",
  logout: "/api/v1/Account/logout",
  changePassword: "/api/v1/Account/changePassword",
  resetUserPassword: "/api/v1/Account/resetUserPassword",
  loginWithExternalIdentity: "/api/v1/Account/loginWithExternalIdentity",
  updatePreferredLanguage: "/api/v1/Account/updatePreferredLanguage",
  registerAccount: "/api/v1/Account/registerAccount",
  dispatchersPagedList: "/api/v1/Account/getDispatchersPagedList",
  updateUserDepots: "/api/v1/Account/updateUserDepots",
  deactivateUser: "/api/v1/Account/deactivateUser",
  reactivateUser: "/api/v1/Account/reactivateUser",
  depots: "/api/v1/Depot/getDepots",
  createDepot: "/api/v1/Depot/createDepot",
  updateDepot: "/api/v1/Depot/updateDepot",
  deleteDepot: "/api/v1/Depot/deleteDepot",
  createAuto: "/api/v1/Auto/createAuto",
  updateAuto: "/api/v1/Auto/updateAuto",
  deleteAuto: "/api/v1/Auto/deleteAuto",
  restoreAuto: "/api/v1/Auto/restoreAuto",
  autosPagedList: "/api/v1/Auto/getAutosPagedList",
  autoLookupOptions: "/api/v1/Auto/getAutoLookupOptions",
  createDriver: "/api/v1/Driver/createDriver",
  updateDriver: "/api/v1/Driver/updateDriver",
  deleteDriver: "/api/v1/Driver/deleteDriver",
  restoreDriver: "/api/v1/Driver/restoreDriver",
  driversPagedList: "/api/v1/Driver/getDriversPagedList",
  driverLookupOptions: "/api/v1/Driver/getDriverLookupOptions",
  searchCityGeocodingCandidates:
    "/api/v1/Location/searchCityGeocodingCandidates",
  ensureCityLocation: "/api/v1/Location/ensureCityLocation",
  createRoute: "/api/v1/Route/createRoute",
  updateRoute: "/api/v1/Route/updateRoute",
  deleteRoute: "/api/v1/Route/deleteRoute",
  routesPagedList: "/api/v1/Route/getRoutesPagedList",
  routesPeriodReport: "/api/v1/Route/getRoutesPeriodReport",
  createAutoMaintenance: "/api/v1/AutoMaintenance/createAutoMaintenance",
  updateAutoMaintenance: "/api/v1/AutoMaintenance/updateAutoMaintenance",
  autoMaintenancesByAutoId:
    "/api/v1/AutoMaintenance/getAutoMaintenancesByAutoId",
  auditLogsPagedList: "/api/v1/AuditLog/getAuditLogsPagedList",
  dashboardSummary: "/api/v1/Dashboard/getDashboardSummary",
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
  action: "action",
  timeFromDate: "timeFromDate",
  timeToDate: "timeToDate",
  startCity: "startCity",
  destinationCity: "destinationCity",
  departureFromDate: "departureFromDate",
  departureToDate: "departureToDate",
  driverId: "driverId",
  autoId: "autoId",
  depotId: "depotId",
  isArchived: "isArchived",
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

export const archivedRecordsFilterValue = "true"

export const recentRoutesBlockSettings = Object.freeze({
  routesCount: 5,
})

export const routesPeriodPresetSettings = Object.freeze({
  lastWeekDaysCount: 7,
})

export const routeSortOptions: ReadonlyArray<SortOption<RouteSortField>> =
  Object.freeze([
    {
      sortField: RouteSortField.DepartureTime,
      labelMessageKey: "departureTime",
    },
    { sortField: RouteSortField.ArrivalTime, labelMessageKey: "arrivalTime" },
    { sortField: RouteSortField.Status, labelMessageKey: "status" },
    { sortField: RouteSortField.Id, labelMessageKey: "id" },
  ])

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
    { href: appRoutes.drivers, labelMessageKey: "drivers", isAdminOnly: true },
    { href: appRoutes.autos, labelMessageKey: "autos", isAdminOnly: true },
    {
      href: appRoutes.dispatchers,
      labelMessageKey: "dispatchers",
      isAdminOnly: true,
    },
    { href: appRoutes.routes, labelMessageKey: "routes", isAdminOnly: false },
    { href: appRoutes.reports, labelMessageKey: "reports", isAdminOnly: false },
    {
      href: appRoutes.auditLogs,
      labelMessageKey: "auditLogs",
      isAdminOnly: true,
    },
    { href: appRoutes.depots, labelMessageKey: "depots", isAdminOnly: true },
  ])

export const fastAccessNavigationLinks: ReadonlyArray<NavigationLink> =
  Object.freeze([
    {
      href: appRoutes.drivers,
      labelMessageKey: "driversFastAccess",
      isAdminOnly: true,
    },
    {
      href: appRoutes.autos,
      labelMessageKey: "autosFastAccess",
      isAdminOnly: true,
    },
    {
      href: appRoutes.routes,
      labelMessageKey: "routesFastAccess",
      isAdminOnly: false,
    },
    {
      href: appRoutes.reports,
      labelMessageKey: "reportsFastAccess",
      isAdminOnly: false,
    },
  ])

export const autosTableColumns: ReadonlyArray<TableColumn<AutoSortField>> =
  Object.freeze([
    { labelMessageKey: "id", className: "w-1/12", sortField: AutoSortField.Id },
    {
      labelMessageKey: "mark",
      className: "w-1/6",
      sortField: AutoSortField.Mark,
    },
    {
      labelMessageKey: "model",
      className: "w-1/6",
      sortField: AutoSortField.Model,
    },
    {
      labelMessageKey: "color",
      className: "w-1/6",
      sortField: AutoSortField.Color,
    },
    {
      labelMessageKey: "status",
      className: "w-1/6",
      sortField: AutoSortField.Status,
    },
    {
      labelMessageKey: "number",
      className: "w-1/6",
      sortField: AutoSortField.Number,
    },
    { labelMessageKey: "depot", className: "w-1/6" },
    { labelMessageKey: "operations", className: "w-1/6 text-center" },
  ])

export const driversTableColumns: ReadonlyArray<TableColumn<DriverSortField>> =
  Object.freeze([
    {
      labelMessageKey: "id",
      className: "w-1/6",
      sortField: DriverSortField.Id,
    },
    {
      labelMessageKey: "name",
      className: "w-1/6",
      sortField: DriverSortField.Name,
    },
    {
      labelMessageKey: "surname",
      className: "w-1/6",
      sortField: DriverSortField.Surname,
    },
    {
      labelMessageKey: "patronymic",
      className: "w-1/6",
      sortField: DriverSortField.Patronymic,
    },
    {
      labelMessageKey: "licenseNumber",
      className: "w-1/6",
      sortField: DriverSortField.LicenseNumber,
    },
    { labelMessageKey: "depot", className: "w-1/6" },
    { labelMessageKey: "operations", className: "w-1/6 text-center" },
  ])

export const dispatchersTableColumns: ReadonlyArray<
  TableColumn<DispatcherSortField>
> = Object.freeze([
  {
    labelMessageKey: "id",
    className: "w-1/4",
    sortField: DispatcherSortField.Id,
  },
  {
    labelMessageKey: "username",
    className: "w-1/4",
    sortField: DispatcherSortField.Username,
  },
  {
    labelMessageKey: "email",
    className: "w-1/4",
    sortField: DispatcherSortField.Email,
  },
  { labelMessageKey: "depot", className: "w-1/4" },
  { labelMessageKey: "operations", className: "w-1/4 text-center" },
])

export const depotsTableColumns: ReadonlyArray<TableColumn> = Object.freeze([
  { labelMessageKey: "id", className: "w-1/6" },
  { labelMessageKey: "depotName", className: "w-1/2" },
  { labelMessageKey: "operations", className: "w-1/3 text-center" },
])

export const recentRoutesTableColumns: ReadonlyArray<TableColumn> =
  Object.freeze([
    { labelMessageKey: "id", className: "w-1/6" },
    { labelMessageKey: "fromTo", className: "w-2/6" },
    { labelMessageKey: "departure", className: "w-1/6" },
    { labelMessageKey: "arrival", className: "w-1/6" },
    { labelMessageKey: "status", className: "w-1/6 text-right" },
  ])

export const driverFormFields: ReadonlyArray<DriverFormField> = Object.freeze([
  { name: "name", labelMessageKey: "nameLabel" },
  { name: "surname", labelMessageKey: "surnameLabel" },
  { name: "patronymic", labelMessageKey: "patronymicLabel" },
  { name: "licenseNumber", labelMessageKey: "licenseNumberLabel" },
])

export const routeStatusActions: ReadonlyArray<RouteStatusAction> =
  Object.freeze([
    {
      targetRouteStatus: RouteStatus.InProgress,
      icon: Play,
      variant: "accent",
    },
    {
      targetRouteStatus: RouteStatus.Completed,
      icon: CheckCircle,
      variant: "success",
    },
    {
      targetRouteStatus: RouteStatus.Cancelled,
      icon: XCircle,
      variant: "warning",
    },
  ])

export const auditLogsTableColumns: ReadonlyArray<
  TableColumn<AuditLogSortField>
> = Object.freeze([
  {
    labelMessageKey: "time",
    className: "w-1/6",
    sortField: AuditLogSortField.Time,
  },
  {
    labelMessageKey: "action",
    className: "w-1/5",
    sortField: AuditLogSortField.Action,
  },
  {
    labelMessageKey: "user",
    className: "w-1/6",
    sortField: AuditLogSortField.DispatcherUsername,
  },
  {
    labelMessageKey: "entityId",
    className: "w-1/12",
    sortField: AuditLogSortField.EntityId,
  },
  { labelMessageKey: "changes", className: "w-1/3" },
])

export const reportDriverSummariesTableColumns: ReadonlyArray<TableColumn> =
  Object.freeze([
    { labelMessageKey: "driver", className: "w-2/5" },
    { labelMessageKey: "routesCount", className: "w-1/5 text-center" },
    { labelMessageKey: "completedRoutesCount", className: "w-1/5 text-center" },
    { labelMessageKey: "drivingHours", className: "w-1/5 text-center" },
  ])

export const reportRoutesTableColumns: ReadonlyArray<TableColumn> =
  Object.freeze([
    { labelMessageKey: "id", className: "w-1/12" },
    { labelMessageKey: "fromTo", className: "w-3/12" },
    { labelMessageKey: "departure", className: "w-2/12" },
    { labelMessageKey: "arrival", className: "w-2/12" },
    { labelMessageKey: "driver", className: "w-2/12" },
    { labelMessageKey: "status", className: "w-2/12 text-right" },
  ])

export const depotNameConstraints = Object.freeze({
  maxLength: 100,
})

export const traceContextFormat = Object.freeze({
  version: "00",
  sampledTraceFlags: "01",
  traceIdByteLength: 16,
  parentIdByteLength: 8,
  traceparentPattern: /^00-([0-9a-f]{32})-([0-9a-f]{16})-[0-9a-f]{2}$/,
})

export const cityGeocodingSearchConstraints = Object.freeze({
  minLength: 2,
  maxLength: 100,
  debounceDelayInMilliseconds: 350,
})

export const mapCoordinatesFractionDigits = 4

export const cityGeocodingAttributionLinks = Object.freeze({
  openMeteo: "https://open-meteo.com/",
  geoNames: "https://www.geonames.org/",
  license: "https://creativecommons.org/licenses/by/4.0/",
})

export const defaultAppLocale = AppLocale.Ukrainian

export const intlLocaleCodes: Readonly<Record<AppLocale, string>> =
  Object.freeze({
    [AppLocale.Ukrainian]: "uk-UA",
    [AppLocale.English]: "en-GB",
  })

export const appToasterPositions: Readonly<{
  page: ToastPosition
  modalWindow: ToastPosition
}> = Object.freeze({
  page: "bottom-right",
  modalWindow: "top-center",
})

export const backendRequestSettings: Readonly<{
  timeoutInMilliseconds: number
}> = Object.freeze({
  timeoutInMilliseconds: 20_000,
})
