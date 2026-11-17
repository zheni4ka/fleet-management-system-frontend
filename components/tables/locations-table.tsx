import { useTranslations } from "next-intl"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArchivableTableRowActions } from "@/components/tables/archivable-table-row-actions"
import { EmptyTableRow } from "@/components/tables/empty-table-row"
import { TableColumnsHeader } from "@/components/tables/table-columns-header"
import { formatLocationName } from "@/lib/formatters"
import { hasActiveListFilters } from "@/lib/search-params"
import { apiEndpoints, locationsTableColumns } from "@/lib/constants"
import {
  BadgeTone,
  ListPageState,
  Location,
  LocationSortField,
} from "@/lib/types"

interface LocationsTableProps {
  locations: Location[]
  listPageState: ListPageState<LocationSortField>
}

export function LocationsTable({
  locations,
  listPageState,
}: LocationsTableProps) {
  const listFilterTranslations = useTranslations("listFilters")
  const locationTranslations = useTranslations("locations")
  const commonTranslations = useTranslations("common")
  return (
    <div className="overflow-hidden rounded-md border bg-white">
      <Table>
        <TableColumnsHeader
          tableColumns={locationsTableColumns}
          listPageState={listPageState}
        />
        <TableBody>
          {locations.length === 0 && (
            <EmptyTableRow
              columnCount={locationsTableColumns.length}
              message={
                hasActiveListFilters(listPageState)
                  ? commonTranslations("nothingFoundMessage")
                  : locationTranslations("emptyList")
              }
            />
          )}
          {locations.map((location) => (
            <TableRow key={location.id} className="hover:bg-slate-50/50">
              <TableCell className="font-mono text-xs">{location.id}</TableCell>
              <TableCell className="font-medium">
                {location.city}
                {location.isArchived && (
                  <span className="ml-2">
                    <Badge tone={BadgeTone.Neutral}>
                      {listFilterTranslations("archivedBadgeLabel")}
                    </Badge>
                  </span>
                )}
              </TableCell>
              <TableCell>{location.country}</TableCell>
              <TableCell className="text-center">
                <ArchivableTableRowActions
                  isArchived={location.isArchived}
                  deleteApiPath={`${apiEndpoints.deleteLocation}/${location.id}`}
                  restoreApiPath={`${apiEndpoints.restoreLocation}/${location.id}`}
                  deletionQuestion={locationTranslations("deletionQuestion", {
                    locationName: formatLocationName(location),
                  })}
                  deletionToastMessages={{
                    loading: locationTranslations("deleteLoading"),
                    success: locationTranslations("deleteSuccess"),
                    error: locationTranslations("deleteError"),
                  }}
                  archivedInsteadOfDeletedMessage={locationTranslations(
                    "archivedInsteadOfDeleted"
                  )}
                  restoreToastMessages={{
                    loading: locationTranslations("restoreLoading"),
                    success: locationTranslations("restoreSuccess"),
                    error: locationTranslations("restoreError"),
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default LocationsTable
