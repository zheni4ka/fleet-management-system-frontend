import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { resolveAppLocale } from "@/lib/app-locale"
import { formatDateTime, formatDrivingMinutes } from "@/lib/formatters"
import { BadgeTone, Driver, DriverTripSummary } from "@/lib/types"

interface DriverProfileOverviewProps {
  driver: Driver
  driverTripSummary: DriverTripSummary
}

interface DriverProfileRow {
  label: string
  value: React.ReactNode
}

interface DriverProfileSectionProps {
  title: string
  driverProfileRows: ReadonlyArray<DriverProfileRow>
}

function DriverProfileSection({
  title,
  driverProfileRows,
}: DriverProfileSectionProps) {
  return (
    <section className="rounded-xl border bg-white p-4">
      <h2 className="mb-2 text-sm font-semibold text-slate-800">{title}</h2>
      <dl>
        {driverProfileRows.map((driverProfileRow) => (
          <div
            key={driverProfileRow.label}
            className="flex items-baseline justify-between gap-4 border-b border-slate-100 py-1.5 last:border-0"
          >
            <dt className="text-sm text-slate-500">{driverProfileRow.label}</dt>
            <dd className="text-right text-sm font-medium break-all text-slate-900">
              {driverProfileRow.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function DriverProfileOverview({
  driver,
  driverTripSummary,
}: DriverProfileOverviewProps) {
  const appLocale = resolveAppLocale(useLocale())
  const driverProfileTranslations = useTranslations("driverProfile")
  const driverTranslations = useTranslations("drivers")
  const listFilterTranslations = useTranslations("listFilters")
  const notSpecifiedLabel = driverProfileTranslations("notSpecifiedLabel")

  const detailsRows: ReadonlyArray<DriverProfileRow> = [
    {
      label: driverTranslations("licenseNumberLabel"),
      value: <Badge tone={BadgeTone.Info}>{driver.licenseNumber}</Badge>,
    },
    { label: listFilterTranslations("depotLabel"), value: driver.depotName },
    {
      label: driverProfileTranslations("recordStateLabel"),
      value: driver.isArchived ? (
        <Badge tone={BadgeTone.Neutral}>
          {listFilterTranslations("archivedBadgeLabel")}
        </Badge>
      ) : (
        driverProfileTranslations("activeRecordLabel")
      ),
    },
  ]
  const contactRows: ReadonlyArray<DriverProfileRow> = [
    {
      label: driverTranslations("phoneNumberLabel"),
      value:
        driver.phoneNumber === null ? (
          notSpecifiedLabel
        ) : (
          <a
            href={`tel:${driver.phoneNumber}`}
            className="text-indigo-700 hover:underline"
          >
            {driver.phoneNumber}
          </a>
        ),
    },
    {
      label: driverTranslations("emailLabel"),
      value:
        driver.email === null ? (
          notSpecifiedLabel
        ) : (
          <a
            href={`mailto:${driver.email}`}
            className="text-indigo-700 hover:underline"
          >
            {driver.email}
          </a>
        ),
    },
  ]
  const tripSummaryRows: ReadonlyArray<DriverProfileRow> = [
    {
      label: driverProfileTranslations("tripsCountLabel"),
      value: driverTripSummary.tripsCount,
    },
    {
      label: driverProfileTranslations("completedTripsCountLabel"),
      value: driverTripSummary.completedTripsCount,
    },
    {
      label: driverProfileTranslations("cancelledTripsCountLabel"),
      value: driverTripSummary.cancelledTripsCount,
    },
    {
      label: driverProfileTranslations("drivingHoursLabel"),
      value: formatDrivingMinutes(driverTripSummary.drivingMinutes, appLocale),
    },
    {
      label: driverProfileTranslations("lastTripEndedAtLabel"),
      value:
        driverTripSummary.lastTripEndedAtUtc === null
          ? notSpecifiedLabel
          : formatDateTime(driverTripSummary.lastTripEndedAtUtc, appLocale),
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <DriverProfileSection
        title={driverTranslations("detailsSectionTitle")}
        driverProfileRows={detailsRows}
      />
      <DriverProfileSection
        title={driverTranslations("contactsSectionTitle")}
        driverProfileRows={contactRows}
      />
      <DriverProfileSection
        title={driverProfileTranslations("tripSummaryTitle")}
        driverProfileRows={tripSummaryRows}
      />
    </div>
  )
}
