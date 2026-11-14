import AutosTable from "@/components/tables/autos-table"
import AddAutoModal from "@/components/add/add-auto-modal"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints } from "@/lib/constants"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import { Auto } from "@/lib/types"

export default async function AutosPage() {
  const authToken = await getAdminAuthTokenOrRedirect()
  const autosResult = await fetchFromApi<Auto[]>(
    apiEndpoints.allAutos,
    authToken
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <PageHeader
        title="Автомобілі"
        description="Управління автомобілями вашого автопарку та перегляд їхніх характеристик."
      >
        <AddAutoModal />
      </PageHeader>

      {autosResult.isSucceeded ? (
        <AutosTable autos={autosResult.data} />
      ) : (
        <LoadErrorMessage errorMessage={autosResult.errorMessage} />
      )}
    </div>
  )
}
