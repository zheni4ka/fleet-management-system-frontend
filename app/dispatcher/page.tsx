import DispatchersTable from "@/components/tables/dispatchers-table"
import AddDispatcherModal from "@/components/add/add-dispatcher-modal"
import { ListFilterPanel } from "@/components/list-filter-panel"
import { ListPagination } from "@/components/list-pagination"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes } from "@/lib/constants"
import { getTranslations } from "next-intl/server"
import { createDispatchersListFilterFields } from "@/lib/forms/list-filter-fields"
import {
  createListApiPath,
  getListFilterValuesFromPageSearchParams,
  getListQueryFromPageSearchParams,
} from "@/lib/search-params"
import {
  fetchFromApi,
  getAdminAuthTokenOrRedirect,
  getFirstApiFetchErrorMessage,
} from "@/lib/server/api"
import {
  DispatcherSortField,
  ListPageState,
  PageSearchParams,
} from "@/lib/types"
import { createPagedListSchema } from "@/lib/schemas/paged-list-schema"
import { dispatcherSchema } from "@/lib/schemas/dispatcher-schema"
import { depotsSchema } from "@/lib/schemas/depot-schema"
import { PageContainer } from "@/components/page-container"

interface DispatchersPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function DispatchersPage({
  searchParams,
}: DispatchersPageProps) {
  const authToken = await getAdminAuthTokenOrRedirect()
  const pageSearchParams = await searchParams
  const translateMessage = await getTranslations()
  const dispatchersListFilterFields =
    createDispatchersListFilterFields(translateMessage)
  const dispatchersListPageState: ListPageState<DispatcherSortField> = {
    path: appRoutes.dispatchers,
    listQuery: getListQueryFromPageSearchParams(
      pageSearchParams,
      DispatcherSortField
    ),
    filterValues: getListFilterValuesFromPageSearchParams(
      pageSearchParams,
      dispatchersListFilterFields
    ),
  }
  const [dispatchersPageResult, depotsResult] = await Promise.all([
    fetchFromApi(
      createListApiPath(
        apiEndpoints.dispatchersPagedList,
        dispatchersListPageState.listQuery,
        dispatchersListPageState.filterValues
      ),
      authToken,
      createPagedListSchema(dispatcherSchema)
    ),
    fetchFromApi(apiEndpoints.depots, authToken, depotsSchema),
  ])

  return (
    <PageContainer>
      <PageHeader
        title={translateMessage("pages.dispatchersTitle")}
        description={translateMessage("pages.dispatchersDescription")}
      >
        {depotsResult.isSucceeded && (
          <AddDispatcherModal depots={depotsResult.data} />
        )}
      </PageHeader>

      <ListFilterPanel
        title={translateMessage("pages.dispatchersFilterTitle")}
        listPageState={dispatchersListPageState}
        listFilterFields={dispatchersListFilterFields}
      />

      {dispatchersPageResult.isSucceeded && depotsResult.isSucceeded ? (
        <>
          <DispatchersTable
            dispatchers={dispatchersPageResult.data.items}
            depots={depotsResult.data}
            listPageState={dispatchersListPageState}
          />
          <ListPagination
            listPageState={dispatchersListPageState}
            totalCount={dispatchersPageResult.data.totalCount}
          />
        </>
      ) : (
        <LoadErrorMessage
          errorMessage={getFirstApiFetchErrorMessage([
            dispatchersPageResult,
            depotsResult,
          ])}
        />
      )}
    </PageContainer>
  )
}
