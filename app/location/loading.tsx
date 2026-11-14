import { TablePageSkeleton } from "@/components/page-skeletons"
import { locationsTableColumns } from "@/lib/constants"

export default function LocationsLoading() {
  return <TablePageSkeleton tableColumns={locationsTableColumns} />
}
