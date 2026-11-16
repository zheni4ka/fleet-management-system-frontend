import { TablePageSkeleton } from "@/components/page-skeletons"
import { depotsTableColumns } from "@/lib/constants"

export default function DepotsLoading() {
  return <TablePageSkeleton tableColumns={depotsTableColumns} />
}
