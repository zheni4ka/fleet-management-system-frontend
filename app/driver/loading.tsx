import { TablePageSkeleton } from "@/components/page-skeletons"
import { driversTableColumns } from "@/lib/constants"

export default function DriversLoading() {
  return <TablePageSkeleton tableColumns={driversTableColumns} />
}
