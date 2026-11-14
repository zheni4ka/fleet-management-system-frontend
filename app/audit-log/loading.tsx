import { TablePageSkeleton } from "@/components/page-skeletons"
import { auditLogsTableColumns } from "@/lib/constants"

export default function AuditLogsLoading() {
  return <TablePageSkeleton tableColumns={auditLogsTableColumns} />
}
