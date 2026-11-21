"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import ModalWindow from "@/components/ui/modal-window"
import { RouteMapFrame } from "@/components/route-map-frame"
import { RouteStatusBadge } from "@/components/route-status-badge"
import { resolveAppLocale } from "@/lib/app-locale"
import {
  createRouteDestinationMapPoint,
  createRouteStartMapPoint,
  formatRouteAutoTitleWithNumber,
  formatRouteDestinationLocationName,
  formatRouteDriverFullName,
  formatRouteStartLocationName,
  formatUtcIntervalHours,
} from "@/lib/formatters"
import { formatUtcDateTimeWithTimeZone } from "@/lib/zoned-date-time"
import { ModalWindowSize, Route } from "@/lib/types"

interface RouteDetailsModalProps {
  route: Route
  onClose: () => void
}

interface RouteDetailRow {
  label: string
  value: string
}

interface RouteDetailsSectionProps {
  title: string
  routeDetailRows: ReadonlyArray<RouteDetailRow>
}

function RouteDetailsSection({
  title,
  routeDetailRows,
}: RouteDetailsSectionProps) {
  return (
    <section className="rounded-lg border border-slate-200 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">{title}</h3>
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-sm">
        {routeDetailRows.map((routeDetailRow) => (
          <React.Fragment key={routeDetailRow.label}>
            <dt className="text-slate-500">{routeDetailRow.label}</dt>
            <dd className="break-words text-slate-800">
              {routeDetailRow.value}
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </section>
  )
}

export function RouteDetailsModal({ route, onClose }: RouteDetailsModalProps) {
  const appLocale = resolveAppLocale(useLocale())
  const routeTranslations = useTranslations("routes")
  const startLocationName = formatRouteStartLocationName(route)
  const destinationLocationName = formatRouteDestinationLocationName(route)

  const formatStartLocationTime = (utcIsoDateTime: string | null): string =>
    utcIsoDateTime === null
      ? routeTranslations("notRecordedValue")
      : formatUtcDateTimeWithTimeZone(
          utcIsoDateTime,
          route.startLocationTimeZoneId,
          appLocale
        )
  const formatDestinationLocationTime = (
    utcIsoDateTime: string | null
  ): string =>
    utcIsoDateTime === null
      ? routeTranslations("notRecordedValue")
      : formatUtcDateTimeWithTimeZone(
          utcIsoDateTime,
          route.destinationLocationTimeZoneId,
          appLocale
        )

  const scheduleRows: ReadonlyArray<RouteDetailRow> = [
    {
      label: routeTranslations("cardDepartureLabel"),
      value: formatStartLocationTime(route.departureTimeUtc),
    },
    {
      label: routeTranslations("cardArrivalLabel"),
      value: formatDestinationLocationTime(route.arrivalTimeUtc),
    },
    {
      label: routeTranslations("plannedDurationLabel"),
      value: formatUtcIntervalHours(
        route.departureTimeUtc,
        route.arrivalTimeUtc,
        appLocale
      ),
    },
    {
      label: routeTranslations("cardActualDepartureLabel"),
      value: formatStartLocationTime(route.actualDepartureTimeUtc),
    },
    {
      label: routeTranslations("cardActualArrivalLabel"),
      value: formatDestinationLocationTime(route.actualArrivalTimeUtc),
    },
    ...(route.actualDepartureTimeUtc === null ||
    route.actualArrivalTimeUtc === null
      ? []
      : [
          {
            label: routeTranslations("actualDurationLabel"),
            value: formatUtcIntervalHours(
              route.actualDepartureTimeUtc,
              route.actualArrivalTimeUtc,
              appLocale
            ),
          },
        ]),
  ]
  const assignmentRows: ReadonlyArray<RouteDetailRow> = [
    {
      label: routeTranslations("startLocationLabel"),
      value: `${startLocationName} (${route.startLocationTimeZoneId})`,
    },
    {
      label: routeTranslations("destinationLocationLabel"),
      value: `${destinationLocationName} (${route.destinationLocationTimeZoneId})`,
    },
    {
      label: routeTranslations("cardAutoLabel"),
      value: formatRouteAutoTitleWithNumber(route),
    },
    {
      label: routeTranslations("cardDriverLabel"),
      value: formatRouteDriverFullName(route),
    },
    { label: routeTranslations("depotLabel"), value: route.depotName },
  ]

  return (
    <ModalWindow
      isOpen
      onClose={onClose}
      size={ModalWindowSize.Wide}
      title={routeTranslations("detailsTitle", { routeId: route.id })}
    >
      <div className="flex flex-wrap items-center gap-2">
        <RouteStatusBadge routeStatus={route.status} />
        <span className="font-semibold text-slate-900">
          {startLocationName} → {destinationLocationName}
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <RouteDetailsSection
          title={routeTranslations("detailsScheduleSection")}
          routeDetailRows={scheduleRows}
        />
        <RouteDetailsSection
          title={routeTranslations("detailsAssignmentSection")}
          routeDetailRows={assignmentRows}
        />
      </div>
      <RouteMapFrame
        originName={startLocationName}
        destinationName={destinationLocationName}
        origin={createRouteStartMapPoint(route)}
        destination={createRouteDestinationMapPoint(route)}
      />
    </ModalWindow>
  )
}
