import { TablePageSkeleton } from "@/components/page-skeletons"
import { dispatchersTableColumns } from "@/lib/constants"

export default function DispatchersLoading() {
  return <TablePageSkeleton tableColumns={dispatchersTableColumns} />
}
