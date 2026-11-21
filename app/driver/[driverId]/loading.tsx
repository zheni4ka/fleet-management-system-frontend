import { TablePageSkeleton } from "@/components/page-skeletons"
import { driverTripsTableColumns } from "@/lib/constants"

export default function DriverProfileLoading() {
  return <TablePageSkeleton tableColumns={driverTripsTableColumns} />
}
