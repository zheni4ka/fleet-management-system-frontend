import { getTranslations } from "next-intl/server"
import { DepotNameModal } from "@/components/depot-name-modal"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { DepotsTable } from "@/components/tables/depots-table"
import { apiEndpoints } from "@/lib/constants"
import { depotsSchema } from "@/lib/schemas/depot-schema"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"

export default async function DepotsPage() {
  const authToken = await getAdminAuthTokenOrRedirect()
  const pageTranslations = await getTranslations("pages")
  const depotsResult = await fetchFromApi(
    apiEndpoints.depots,
    authToken,
    depotsSchema
  )

  return (
    <PageContainer>
      <PageHeader
        title={pageTranslations("depotsTitle")}
        description={pageTranslations("depotsDescription")}
      >
        <DepotNameModal editedDepot={null} />
      </PageHeader>
      {depotsResult.isSucceeded ? (
        <DepotsTable depots={depotsResult.data} />
      ) : (
        <LoadErrorMessage errorMessage={depotsResult.errorMessage} />
      )}
    </PageContainer>
  )
}
