import { TablePageSkeleton } from "@/components/page-skeletons"
import { autosTableColumns } from "@/lib/constants"

export default function AutosLoading() {
  return <TablePageSkeleton tableColumns={autosTableColumns} />
}
