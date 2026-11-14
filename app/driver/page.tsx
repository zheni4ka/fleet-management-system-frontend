import DriversTable from "@/components/tables/drivers-table"
import AddDriverModal from "@/components/add/add-driver-modal"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints } from "@/lib/constants"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import { Driver } from "@/lib/types"

export default async function DriversPage() {
  const authToken = await getAdminAuthTokenOrRedirect()
  const driversResult = await fetchFromApi<Driver[]>(
    apiEndpoints.allDrivers,
    authToken
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <PageHeader
        title="Водії"
        description="Управління водіями вашого автопарку та перегляд їхніх ліцензій."
      >
        <AddDriverModal />
      </PageHeader>

      {driversResult.isSucceeded ? (
        <DriversTable drivers={driversResult.data} />
      ) : (
        <LoadErrorMessage errorMessage={driversResult.errorMessage} />
      )}
    </div>
  )
}
