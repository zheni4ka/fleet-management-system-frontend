import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableColumn } from "@/lib/types"

interface TableColumnsHeaderProps {
  tableColumns: ReadonlyArray<TableColumn>
}

export function TableColumnsHeader({ tableColumns }: TableColumnsHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        {tableColumns.map((tableColumn) => (
          <TableHead key={tableColumn.label} className={tableColumn.className}>
            {tableColumn.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  )
}
