import AddRouteModal from "@/components/add/add-route-modal"
import RoutesList from "@/components/routes-list"
import RoutesSearchForm from "@/components/routes-search-form"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints } from "@/lib/constants"
import { createRoutesSearchFormValuesFromPageSearchParams } from "@/lib/forms/routes-search-form"
import {
  createPathWithSearchParams,
  createSearchParamsFromFormValues,
} from "@/lib/search-params"
import {
  fetchFromApi,
  getAuthTokenOrRedirect,
  getFirstApiFetchErrorMessage,
} from "@/lib/server/api"
import { Auto, Driver, Location, PageSearchParams, Route } from "@/lib/types"

const routesPageTitle = "Маршрути"
const routesPageDescription =
  "Перегляд доступних маршрутів із деталями відправлення, прибуття, автомобіля та водія."

interface RoutesPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function RoutesPage({ searchParams }: RoutesPageProps) {
  const authToken = await getAuthTokenOrRedirect()
  const routesSearchFormValues =
    createRoutesSearchFormValuesFromPageSearchParams(await searchParams)
  const routesSearchParams = createSearchParamsFromFormValues(
    routesSearchFormValues
  )

  const [routesResult, autosResult, driversResult, locationsResult] =
    await Promise.all([
      fetchFromApi<Route[]>(
        createPathWithSearchParams(
          apiEndpoints.routesSearch,
          routesSearchParams
        ),
        authToken
      ),
      fetchFromApi<Auto[]>(apiEndpoints.allAutos, authToken),
      fetchFromApi<Driver[]>(apiEndpoints.allDrivers, authToken),
      fetchFromApi<Location[]>(apiEndpoints.allLocations, authToken),
    ])

  if (
    !routesResult.isSucceeded ||
    !autosResult.isSucceeded ||
    !driversResult.isSucceeded ||
    !locationsResult.isSucceeded
  ) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-8">
        <PageHeader
          title={routesPageTitle}
          description={routesPageDescription}
        />
        <LoadErrorMessage
          errorMessage={getFirstApiFetchErrorMessage([
            routesResult,
            autosResult,
            driversResult,
            locationsResult,
          ])}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <PageHeader title={routesPageTitle} description={routesPageDescription}>
        <AddRouteModal
          autos={autosResult.data}
          drivers={driversResult.data}
          locations={locationsResult.data}
        />
      </PageHeader>

      <RoutesSearchForm
        key={routesSearchParams.toString()}
        initialRoutesSearchFormValues={routesSearchFormValues}
        autos={autosResult.data}
        drivers={driversResult.data}
      />

      <RoutesList
        routes={routesResult.data}
        locations={locationsResult.data}
        autos={autosResult.data}
        drivers={driversResult.data}
      />
    </div>
  )
}
