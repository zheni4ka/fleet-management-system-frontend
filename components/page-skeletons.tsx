import type { ReactNode } from "react"
import { useTranslations } from "next-intl"
import { PageContainer } from "@/components/page-container"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableColumn } from "@/lib/types"

const skeletonTableRowsCount = 8
const skeletonRouteCardsCount = 6
const skeletonReportKpiCardsCount = 4

interface PageSkeletonLayoutProps {
  children: ReactNode
}

function PageSkeletonLayout({ children }: PageSkeletonLayoutProps) {
  const commonTranslations = useTranslations("common")
  return (
    <PageContainer role="status" aria-busy="true">
      <span className="sr-only">{commonTranslations("loadingLabel")}</span>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-8 w-36" />
      </div>
      {children}
    </PageContainer>
  )
}

function FilterPanelSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border bg-white p-4 shadow-sm">
      <Skeleton className="h-4 w-40" />
      <div className="grid gap-3 md:grid-cols-4">
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
      </div>
    </div>
  )
}

function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-56" />
    </div>
  )
}

interface TablePageSkeletonProps {
  tableColumns: ReadonlyArray<TableColumn<string>>
}

export function TablePageSkeleton({ tableColumns }: TablePageSkeletonProps) {
  const tableColumnsTranslations = useTranslations("tableColumns")
  return (
    <PageSkeletonLayout>
      <FilterPanelSkeleton />
      <div className="overflow-hidden rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {tableColumns.map((tableColumn) => (
                <TableHead
                  key={tableColumn.labelMessageKey}
                  className={tableColumn.className}
                >
                  {tableColumnsTranslations(tableColumn.labelMessageKey)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from(
              { length: skeletonTableRowsCount },
              (_, skeletonRowNumber) => (
                <TableRow key={skeletonRowNumber}>
                  {tableColumns.map((tableColumn) => (
                    <TableCell key={tableColumn.labelMessageKey}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationSkeleton />
    </PageSkeletonLayout>
  )
}

export function RoutesPageSkeleton() {
  return (
    <PageSkeletonLayout>
      <FilterPanelSkeleton />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from(
          { length: skeletonRouteCardsCount },
          (_, skeletonRouteCardNumber) => (
            <div
              key={skeletonRouteCardNumber}
              className="space-y-3 rounded-2xl border bg-white p-5 shadow-sm"
            >
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )
        )}
      </div>
      <PaginationSkeleton />
    </PageSkeletonLayout>
  )
}

export function ReportPageSkeleton() {
  return (
    <PageSkeletonLayout>
      <div className="space-y-3 rounded-xl border bg-white p-4 shadow-sm">
        <Skeleton className="h-4 w-40" />
        <div className="grid gap-3 md:grid-cols-3">
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from(
          { length: skeletonReportKpiCardsCount },
          (_, skeletonKpiCardNumber) => (
            <div
              key={skeletonKpiCardNumber}
              className="space-y-2 rounded-xl border bg-white p-4 shadow-sm"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
          )
        )}
      </div>
    </PageSkeletonLayout>
  )
}

export function GenericPageSkeleton() {
  return (
    <PageSkeletonLayout>
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    </PageSkeletonLayout>
  )
}
