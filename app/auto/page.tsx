import AutosTable from "@/components/tables/autos-table"
import AddAutoModal from "@/components/add/add-auto-modal"
import { ListPagination } from "@/components/list-pagination"
import { ListSearchForm } from "@/components/list-search-form"
import { LoadErrorMessage } from "@/components/load-error-message"
import { PageHeader } from "@/components/page-header"
import { apiEndpoints, appRoutes } from "@/lib/constants"
import {
  createListApiPath,
  getListQueryFromPageSearchParams,
} from "@/lib/search-params"
import { fetchFromApi, getAdminAuthTokenOrRedirect } from "@/lib/server/api"
import {
  Auto,
  AutoSortField,
  ListPageState,
  PageSearchParams,
  PagedList,
} from "@/lib/types"

interface AutosPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function AutosPage({ searchParams }: AutosPageProps) {
  const authToken = await getAdminAuthTokenOrRedirect()
  const autosListPageState: ListPageState<AutoSortField> = {
    path: appRoutes.autos,
    listQuery: getListQueryFromPageSearchParams(
      await searchParams,
      AutoSortField
    ),
    filterValues: {},
  }
  const autosPageResult = await fetchFromApi<PagedList<Auto>>(
    createListApiPath(
      apiEndpoints.autosPagedList,
      autosListPageState.listQuery
    ),
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

      <ListSearchForm
        key={autosListPageState.listQuery.search}
        listPageState={autosListPageState}
        placeholder="Пошук авто (марка, модель, колір, номер)..."
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
    </div>
  )
}
