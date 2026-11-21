import Link from "next/link"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { DriverProfileOverview } from "@/components/driver-profile-overview"
import { ListPagination } from "@/components/list-pagination"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { DriverTripsTable } from "@/components/tables/driver-trips-table"
import { Button } from "@/components/ui/button"
import { createDriverProfilePath } from "@/lib/app-route-paths"
import { hasAuthTokenUserRole } from "@/lib/auth-token"
import { apiEndpoints, appRoutes } from "@/lib/constants"
import { formatDriverFullNameWithPatronymic } from "@/lib/formatters"
import { driverSchema } from "@/lib/schemas/driver-schema"
import { driverTripSchema } from "@/lib/schemas/driver-trip-schema"
import { driverTripSummarySchema } from "@/lib/schemas/driver-trip-summary-schema"
import { createPagedListSchema } from "@/lib/schemas/paged-list-schema"
import {
  createListApiPath,
  getListQueryFromPageSearchParams,
  parsePositiveIntegerSearchParamValue,
} from "@/lib/search-params"
import {
  fetchFromApi,
  getAuthTokenOrRedirect,
  getFirstApiFetchErrorMessage,
} from "@/lib/server/api"
import {
  redirectToCanonicalListPageHref,
  redirectToLastListPageWhenPageOutOfRange,
} from "@/lib/server/list-page-redirects"
import {
  DriverTripSortField,
  ListPageState,
  PageSearchParams,
  UserRole,
} from "@/lib/types"

interface DriverProfilePageProps {
  params: Promise<{ driverId: string }>
  searchParams: Promise<PageSearchParams>
}

export default async function DriverProfilePage({
  params,
  searchParams,
}: DriverProfilePageProps) {
  const authToken = await getAuthTokenOrRedirect()
  const driverId = parsePositiveIntegerSearchParamValue((await params).driverId)
  if (driverId === null) {
    notFound()
  }
  const pageSearchParams = await searchParams
  const driverProfileTranslations = await getTranslations("driverProfile")

  const driverTripsListPageState: ListPageState<DriverTripSortField> = {
    path: createDriverProfilePath(driverId),
    listQuery: getListQueryFromPageSearchParams(
      pageSearchParams,
      DriverTripSortField
    ),
    filterValues: {},
  }
  redirectToCanonicalListPageHref(driverTripsListPageState, pageSearchParams)

  const [driverResult, driverTripSummaryResult, driverTripsPageResult] =
    await Promise.all([
      fetchFromApi(
        `${apiEndpoints.driverById}/${driverId}`,
        authToken,
        driverSchema
      ),
      fetchFromApi(
        `${apiEndpoints.driverTripSummary}/${driverId}`,
        authToken,
        driverTripSummarySchema
      ),
      fetchFromApi(
        createListApiPath(
          apiEndpoints.driverTripsPagedList,
          driverTripsListPageState.listQuery,
          { driverId: String(driverId) }
        ),
        authToken,
        createPagedListSchema(driverTripSchema)
      ),
    ])

  const backToDriversLink = hasAuthTokenUserRole(authToken, UserRole.Admin) ? (
    <Button asChild variant="outline">
      <Link href={appRoutes.drivers}>
        {driverProfileTranslations("backToDriversLabel")}
      </Link>
    </Button>
  ) : null

  if (
    !driverResult.isSucceeded ||
    !driverTripSummaryResult.isSucceeded ||
    !driverTripsPageResult.isSucceeded
  ) {
    return (
      <PageContainer>
        <PageHeader
          title={driverProfileTranslations("title")}
          description={driverProfileTranslations("description")}
        >
          {backToDriversLink}
        </PageHeader>
        <LoadErrorMessage
          errorMessage={getFirstApiFetchErrorMessage([
            driverResult,
            driverTripSummaryResult,
            driverTripsPageResult,
          ])}
        />
      </PageContainer>
    )
  }

  redirectToLastListPageWhenPageOutOfRange(
    driverTripsListPageState,
    driverTripsPageResult.data.totalCount
  )

  return (
    <PageContainer>
      <PageHeader
        title={formatDriverFullNameWithPatronymic(driverResult.data)}
        description={driverProfileTranslations("description")}
      >
        {backToDriversLink}
      </PageHeader>

      <DriverProfileOverview
        driver={driverResult.data}
        driverTripSummary={driverTripSummaryResult.data}
      />

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-800">
          {driverProfileTranslations("tripHistoryTitle")}
        </h2>
        <DriverTripsTable
          driverTrips={driverTripsPageResult.data.items}
          listPageState={driverTripsListPageState}
        />
        <ListPagination
          listPageState={driverTripsListPageState}
          totalCount={driverTripsPageResult.data.totalCount}
        />
      </section>
    </PageContainer>
  )
}
