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
import { fetchFromApi, getAuthTokenOrRedirect } from "@/lib/server/api"
import { PageSearchParams, RoutesPeriodFormValues } from "@/lib/types"
import { routesPeriodReportSchema } from "@/lib/schemas/routes-period-report-schema"
import { PageContainer } from "@/components/page-container"

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
  const routesPeriodReportResult = await fetchFromApi(
    createPathWithSearchParams(
      apiEndpoints.routesPeriodReport,
      createSearchParamsFromFormValues(routesPeriodFormValues)
    ),
    authToken,
    routesPeriodReportSchema
  )

  if (!routesPeriodReportResult.isSucceeded) {
    return (
      <LoadErrorMessage errorMessage={routesPeriodReportResult.errorMessage} />
    )
  }

  return (
    <RoutesPeriodReportView
      routesPeriodReport={routesPeriodReportResult.data}
    />
  )
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const authToken = await getAuthTokenOrRedirect()
  const routesPeriodFormValues =
    createRoutesPeriodFormValuesFromPageSearchParams(await searchParams)

  return (
    <PageContainer>
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
    </PageContainer>
  )
}
