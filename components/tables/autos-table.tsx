import { useTranslations } from "next-intl"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import EditAutoModal from "@/components/edit/edit-auto-modal"
import AutoMaintenanceManagementModal from "@/components/auto-maintenance-management-modal"
import { ArchivableTableRowActions } from "@/components/tables/archivable-table-row-actions"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { hasActiveListFilters } from "@/lib/search-params"
import { apiEndpoints, autosTableColumns } from "@/lib/constants"
import { formatAutoTitle, formatAutoTitleWithNumber } from "@/lib/formatters"
import {
  Auto,
  AutoSortField,
  BadgeTone,
  Depot,
  ListPageState,
} from "@/lib/types"

interface AutosTableProps {
  autos: Auto[]
  depots: ReadonlyArray<Depot>
  listPageState: ListPageState<AutoSortField>
}

export function AutosTable({ autos, depots, listPageState }: AutosTableProps) {
  const autoStatusTranslations = useTranslations("autoStatus")
  const listFilterTranslations = useTranslations("listFilters")
  const autoTranslations = useTranslations("autos")
  const commonTranslations = useTranslations("common")
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableColumnsHeader
          tableColumns={autosTableColumns}
          listPageState={listPageState}
        />
        <TableBody>
          {autos.length === 0 && (
            <EmptyTableRow
              columnCount={autosTableColumns.length}
              message={
                hasActiveListFilters(listPageState)
                  ? commonTranslations("nothingFoundMessage")
                  : autoTranslations("emptyList")
              }
            />
          )}
          {autos.map((auto) => (
            <TableRow key={auto.id} className="hover:bg-slate-50/50">
              <TableCell className="font-mono text-xs">{auto.id}</TableCell>
              <TableCell className="font-medium">{auto.mark}</TableCell>
              <TableCell>{auto.model}</TableCell>
              <TableCell>{auto.color}</TableCell>
              <TableCell>
                <Badge tone={BadgeTone.Neutral}>
                  {autoStatusTranslations(auto.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge tone={BadgeTone.Info}>{auto.number}</Badge>
                {auto.isArchived && (
                  <span className="ml-2">
                    <Badge tone={BadgeTone.Neutral}>
                      {listFilterTranslations("archivedBadgeLabel")}
                    </Badge>
                  </span>
                )}
              </TableCell>
              <TableCell>{auto.depotName}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  {!auto.isArchived && (
                    <>
                      <AutoMaintenanceManagementModal
                        autoId={auto.id}
                        autoTitle={formatAutoTitle(auto)}
                      />
                      <EditAutoModal auto={auto} depots={depots} />
                    </>
                  )}
                  <ArchivableTableRowActions
                    isArchived={auto.isArchived}
                    deleteApiPath={`${apiEndpoints.deleteAuto}/${auto.id}`}
                    restoreApiPath={`${apiEndpoints.restoreAuto}/${auto.id}`}
                    deletionQuestion={autoTranslations("deletionQuestion", {
                      autoTitle: formatAutoTitleWithNumber(auto),
                    })}
                    deletionToastMessages={{
                      loading: autoTranslations("deleteLoading"),
                      success: autoTranslations("deleteSuccess"),
                      error: autoTranslations("deleteError"),
                    }}
                    archivedInsteadOfDeletedMessage={autoTranslations(
                      "archivedInsteadOfDeleted"
                    )}
                    restoreToastMessages={{
                      loading: autoTranslations("restoreLoading"),
                      success: autoTranslations("restoreSuccess"),
                      error: autoTranslations("restoreError"),
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AutosTable
