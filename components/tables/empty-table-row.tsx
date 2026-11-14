import { TableCell, TableRow } from "@/components/ui/table"

interface EmptyTableRowProps {
  columnCount: number
  message: string
}

export function EmptyTableRow({ columnCount, message }: EmptyTableRowProps) {
  return (
    <TableRow>
      <TableCell
        colSpan={columnCount}
        className="h-24 text-center text-muted-foreground"
      >
        {message}
      </TableCell>
    </TableRow>
  )
}
