import { useTranslations } from "next-intl"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EditUserDepotsModal } from "@/components/edit/edit-user-depots-modal"
import { ResetUserPasswordTableRowAction } from "@/components/tables/reset-user-password-table-row-action"
import { UserActivationTableRowAction } from "@/components/tables/user-activation-table-row-action"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { formatDepotNames } from "@/lib/formatters"
import { hasActiveListFilters } from "@/lib/search-params"
import { dispatchersTableColumns } from "@/lib/constants"
import {
  BadgeTone,
  Depot,
  Dispatcher,
  DispatcherSortField,
  ListPageState,
} from "@/lib/types"

interface DispatchersTableProps {
  dispatchers: Dispatcher[]
  depots: ReadonlyArray<Depot>
  listPageState: ListPageState<DispatcherSortField>
}

export function DispatchersTable({
  dispatchers,
  depots,
  listPageState,
}: DispatchersTableProps) {
  const listFilterTranslations = useTranslations("listFilters")
  const dispatcherTranslations = useTranslations("dispatchers")
  const commonTranslations = useTranslations("common")
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableColumnsHeader
          tableColumns={dispatchersTableColumns}
          listPageState={listPageState}
        />
        <TableBody>
          {dispatchers.length === 0 && (
            <EmptyTableRow
              columnCount={dispatchersTableColumns.length}
              message={
                hasActiveListFilters(listPageState)
                  ? commonTranslations("nothingFoundMessage")
                  : dispatcherTranslations("emptyList")
              }
            />
          )}
          {dispatchers.map((dispatcher) => (
            <TableRow key={dispatcher.id} className="hover:bg-slate-50/50">
              <TableCell className="font-mono text-xs">
                {dispatcher.id}
              </TableCell>
              <TableCell className="font-medium">
                {dispatcher.username}
                {dispatcher.isDeactivated && (
                  <span className="ml-2">
                    <Badge tone={BadgeTone.Neutral}>
                      {listFilterTranslations("deactivatedBadgeLabel")}
                    </Badge>
                  </span>
                )}
              </TableCell>
              <TableCell>{dispatcher.email ?? "—"}</TableCell>
              <TableCell>
                {formatDepotNames(dispatcher.depotIds, depots)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  {!dispatcher.isDeactivated && (
                    <>
                      <EditUserDepotsModal
                        dispatcher={dispatcher}
                        depots={depots}
                      />
                      <ResetUserPasswordTableRowAction
                        userId={dispatcher.id}
                        username={dispatcher.username}
                      />
                    </>
                  )}
                  <UserActivationTableRowAction dispatcher={dispatcher} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default DispatchersTable
