import RoutesPeriodForm from "@/components/report/routes-period-form"
import RoutesPeriodReportView from "@/components/report/routes-period-report-view"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints } from "@/lib/constants"
import {
  createRoutesPeriodFormValuesFromPageSearchParams,
  getIsRoutesPeriodFormFilled,
} from "@/lib/forms/routes-period-form"
import {
  createPathWithSearchParams,
  createSearchParamsFromFormValues,
} from "@/lib/search-params"
import {
  fetchFromApi,
  getAuthTokenOrRedirect,
  getFirstApiFetchErrorMessage,
} from "@/lib/server/api"
import {
  Driver,
  Location,
  PageSearchParams,
  RoutesPeriodFormValues,
  RoutesPeriodReport,
} from "@/lib/types"

interface ReportsPageProps {
  searchParams: Promise<PageSearchParams>
}

interface RoutesPeriodReportSectionProps {
  routesPeriodFormValues: RoutesPeriodFormValues
  authToken: string
}

async function RoutesPeriodReportSection({
  routesPeriodFormValues,
  authToken,
}: RoutesPeriodReportSectionProps) {
  const [routesPeriodReportResult, driversResult, locationsResult] =
    await Promise.all([
      fetchFromApi<RoutesPeriodReport>(
        createPathWithSearchParams(
          apiEndpoints.routesPeriodReport,
          createSearchParamsFromFormValues(routesPeriodFormValues)
        ),
        authToken
      ),
      fetchFromApi<Driver[]>(apiEndpoints.allDrivers, authToken),
      fetchFromApi<Location[]>(apiEndpoints.allLocations, authToken),
    ])

  if (
    !routesPeriodReportResult.isSucceeded ||
    !driversResult.isSucceeded ||
    !locationsResult.isSucceeded
  ) {
    return (
      <LoadErrorMessage
        errorMessage={getFirstApiFetchErrorMessage([
          routesPeriodReportResult,
          driversResult,
          locationsResult,
        ])}
      />
    )
  }

  return (
    <RoutesPeriodReportView
      routesPeriodReport={routesPeriodReportResult.data}
      drivers={driversResult.data}
      locations={locationsResult.data}
    />
  )
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const authToken = await getAuthTokenOrRedirect()
  const routesPeriodFormValues =
    createRoutesPeriodFormValuesFromPageSearchParams(await searchParams)

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-1 py-6 sm:p-8">
      <PageHeader
        title="Звіти"
        description="Статистика рейсів за обраний період: день, тиждень або місяць."
      />

      <RoutesPeriodForm
        key={`${routesPeriodFormValues.periodStartDate}-${routesPeriodFormValues.periodEndDate}`}
        initialRoutesPeriodFormValues={routesPeriodFormValues}
      />

      {getIsRoutesPeriodFormFilled(routesPeriodFormValues) ? (
        <RoutesPeriodReportSection
          routesPeriodFormValues={routesPeriodFormValues}
          authToken={authToken}
        />
      ) : (
        <p className="rounded-xl border border-dashed bg-white py-12 text-center text-slate-500">
          Оберіть період, щоб сформувати звіт.
        </p>
      )}
    </div>
  )
}
