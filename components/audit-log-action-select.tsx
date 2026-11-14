"use client"

import { useRouter } from "next/navigation"
import { NativeSelect } from "@/components/ui/native-select"
import {
  auditActionLabels,
  auditLogFilterSearchParamNames,
  firstListPage,
} from "@/lib/constants"
import { createListPageHref } from "@/lib/search-params"
import { AuditAction, AuditLogSortField, ListPageState } from "@/lib/types"

interface AuditLogActionSelectProps {
  listPageState: ListPageState<AuditLogSortField>
  selectedAuditAction: AuditAction | null
}

export function AuditLogActionSelect({
  listPageState,
  selectedAuditAction,
}: AuditLogActionSelectProps) {
  const router = useRouter()

  return (
    <NativeSelect
      value={selectedAuditAction ?? ""}
      onChange={(event) =>
        router.push(
          createListPageHref(
            listPageState,
            { page: firstListPage },
            { [auditLogFilterSearchParamNames.action]: event.target.value }
          )
        )
      }
      className="max-w-xs shadow-sm"
    >
      <option value="">Усі дії</option>
      {Object.values(AuditAction).map((auditAction) => (
        <option key={auditAction} value={auditAction}>
          {auditActionLabels[auditAction]}
        </option>
      ))}
    </NativeSelect>
  )
}
