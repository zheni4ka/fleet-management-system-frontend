import { describe, expect, it } from "vitest"
import {
  auditLogsTableColumns,
  autosTableColumns,
  depotsTableColumns,
  dispatchersTableColumns,
  driverFormFields,
  driversTableColumns,
  fastAccessNavigationLinks,
  headerNavigationLinks,
  recentRoutesTableColumns,
  reportDriverSummariesTableColumns,
  reportRoutesTableColumns,
  routeSortOptions,
  routeStatusActions,
} from "@/lib/constants"
import {
  AppLocale,
  AuditAction,
  AutoStatus,
  FormValidationError,
  LoginRedirectReason,
  PasswordPolicyViolation,
  RouteStatus,
  SortDirection,
  UserRole,
} from "@/lib/types"
import englishMessages from "@/messages/en.json"
import ukrainianMessages from "@/messages/uk.json"

type MessageCatalog = Readonly<Record<string, Readonly<Record<string, string>>>>

const messageCatalogsByAppLocale: ReadonlyArray<[AppLocale, MessageCatalog]> = [
  [AppLocale.Ukrainian, ukrainianMessages],
  [AppLocale.English, englishMessages],
]

function listMessageKeys(
  messageCatalog: MessageCatalog
): ReadonlyArray<string> {
  return Object.entries(messageCatalog)
    .flatMap(([messageNamespace, namespaceMessages]) =>
      Object.keys(namespaceMessages).map(
        (messageKey) => `${messageNamespace}.${messageKey}`
      )
    )
    .sort()
}

const requiredMessageKeys: ReadonlyArray<string> = [
  ...Object.values(AutoStatus).map((autoStatus) => `autoStatus.${autoStatus}`),
  ...Object.values(RouteStatus).map(
    (routeStatus) => `routeStatus.${routeStatus}`
  ),
  ...Object.values(AuditAction).map(
    (auditAction) => `auditAction.${auditAction}`
  ),
  ...Object.values(SortDirection).map(
    (sortDirection) => `sortDirection.${sortDirection}`
  ),
  ...Object.values(UserRole).map((userRole) => `userRoles.${userRole}`),
  ...Object.values(LoginRedirectReason).map(
    (loginRedirectReason) => `loginRedirectReasons.${loginRedirectReason}`
  ),
  ...Object.values(PasswordPolicyViolation).map(
    (passwordPolicyViolation) => `passwordPolicy.${passwordPolicyViolation}`
  ),
  ...Object.values(FormValidationError).map(
    (formValidationError) => `formValidation.${formValidationError}`
  ),
  ...Object.values(AppLocale).map((appLocale) => `language.${appLocale}`),
  ...[
    ...autosTableColumns,
    ...driversTableColumns,
    ...dispatchersTableColumns,
    ...depotsTableColumns,
    ...recentRoutesTableColumns,
    ...auditLogsTableColumns,
    ...reportDriverSummariesTableColumns,
    ...reportRoutesTableColumns,
    ...routeSortOptions,
  ].map((tableColumn) => `tableColumns.${tableColumn.labelMessageKey}`),
  ...[...headerNavigationLinks, ...fastAccessNavigationLinks].map(
    (navigationLink) => `navigation.${navigationLink.labelMessageKey}`
  ),
  ...driverFormFields.map(
    (driverFormField) => `drivers.${driverFormField.labelMessageKey}`
  ),
  ...routeStatusActions.map(
    (routeStatusAction) =>
      `routeStatusActions.${routeStatusAction.targetRouteStatus}`
  ),
]

describe("message catalogs", () => {
  it("define the same keys in every language", () => {
    expect(listMessageKeys(englishMessages)).toEqual(
      listMessageKeys(ukrainianMessages)
    )
  })

  it.each(messageCatalogsByAppLocale)(
    "%s defines every key the code looks up by value",
    (_, messageCatalog) => {
      const definedMessageKeys = new Set(listMessageKeys(messageCatalog))
      expect(
        requiredMessageKeys.filter(
          (requiredMessageKey) => !definedMessageKeys.has(requiredMessageKey)
        )
      ).toEqual([])
    }
  )

  it.each(messageCatalogsByAppLocale)(
    "%s has no empty messages",
    (_, messageCatalog) => {
      const emptyMessageKeys = Object.entries(messageCatalog).flatMap(
        ([messageNamespace, namespaceMessages]) =>
          Object.entries(namespaceMessages)
            .filter(([, messageText]) => messageText.trim() === "")
            .map(([messageKey]) => `${messageNamespace}.${messageKey}`)
      )
      expect(emptyMessageKeys).toEqual([])
    }
  )
})
