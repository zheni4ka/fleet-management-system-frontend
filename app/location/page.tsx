import LocationsTable from "@/components/tables/locations-table"
import AddLocationModal from "@/components/add/add-location-modal"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints } from "@/lib/constants"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import { Location } from "@/lib/types"

export default async function LocationsPage() {
  const authToken = await getAdminAuthTokenOrRedirect()
  const locationsResult = await fetchFromApi<Location[]>(
    apiEndpoints.allLocations,
    authToken
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <PageHeader
        title="Локації"
        description="Довідник міст і країн, між якими прокладаються маршрути."
      >
        <AddLocationModal />
      </PageHeader>

      {locationsResult.isSucceeded ? (
        <LocationsTable locations={locationsResult.data} />
      ) : (
        <LoadErrorMessage errorMessage={locationsResult.errorMessage} />
      )}
    </div>
  )
}
