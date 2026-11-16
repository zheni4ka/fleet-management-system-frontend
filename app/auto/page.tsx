import AutosTable from "@/components/tables/autos-table"
import AddAutoModal from "@/components/add/add-auto-modal"
import { ListFilterPanel } from "@/components/list-filter-panel"
import { ListPagination } from "@/components/list-pagination"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes } from "@/lib/constants"
import { autosListFilterFields } from "@/lib/forms/list-filter-fields"
import {
  createListApiPath,
  getListFilterValuesFromPageSearchParams,
  getListQueryFromPageSearchParams,
} from "@/lib/search-params"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import { AutoSortField, ListPageState, PageSearchParams } from "@/lib/types"
import { createPagedListSchema } from "@/lib/schemas/paged-list-schema"
import { autoSchema } from "@/lib/schemas/auto-schema"
import { PageContainer } from "@/components/page-container"

interface AutosPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function AutosPage({ searchParams }: AutosPageProps) {
  const authToken = await getAdminAuthTokenOrRedirect()
  const pageSearchParams = await searchParams
  const autosListPageState: ListPageState<AutoSortField> = {
    path: appRoutes.autos,
    listQuery: getListQueryFromPageSearchParams(
      pageSearchParams,
      AutoSortField
    ),
    filterValues: getListFilterValuesFromPageSearchParams(
      pageSearchParams,
      autosListFilterFields
    ),
  }
  const autosPageResult = await fetchFromApi(
    createListApiPath(
      apiEndpoints.autosPagedList,
      autosListPageState.listQuery,
      autosListPageState.filterValues
    ),
    authToken,
    createPagedListSchema(autoSchema)
  )

  return (
    <PageContainer>
      <PageHeader
        title="Автомобілі"
        description="Управління автомобілями вашого автопарку та перегляд їхніх характеристик."
      >
        <AddAutoModal />
      </PageHeader>

      <ListFilterPanel
        title="Пошук автомобілів"
        listPageState={autosListPageState}
        listFilterFields={autosListFilterFields}
      />

      {autosPageResult.isSucceeded ? (
        <>
          <AutosTable
            autos={autosPageResult.data.items}
            listPageState={autosListPageState}
          />
          <ListPagination
            listPageState={autosListPageState}
            totalCount={autosPageResult.data.totalCount}
          />
        </>
      ) : (
        <LoadErrorMessage errorMessage={autosPageResult.errorMessage} />
      )}
    </PageContainer>
  )
}
