"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { firstListPage } from "@/lib/constants"
import { createListPageHref } from "@/lib/search-params"
import { ListPageState } from "@/lib/types"

interface ListSearchFormProps<TSortField extends string> {
  listPageState: ListPageState<TSortField>
  placeholder: string
}

export function ListSearchForm<TSortField extends string>({
  listPageState,
  placeholder,
}: ListSearchFormProps<TSortField>) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(listPageState.listQuery.search)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push(
      createListPageHref(listPageState, {
        search: searchQuery.trim(),
        page: firstListPage,
      })
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md gap-2">
      <Input
        type="search"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="bg-white shadow-sm"
      />
      <Button type="submit" variant="outline" className="cursor-pointer">
        <Search className="h-4 w-4" />
        Знайти
      </Button>
    </form>
  )
}
