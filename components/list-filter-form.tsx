"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { FormField } from "@/components/ui/form-field"
import { firstListPage, listSearchParamNames } from "@/lib/constants"
import { createListPageHref } from "@/lib/search-params"
import {
  ListFilterField,
  ListFilterFieldKind,
  ListPageState,
  SearchFormValues,
} from "@/lib/types"

interface ListFilterFormProps<TSortField extends string> {
  listPageState: ListPageState<TSortField>
  listFilterFields: ReadonlyArray<ListFilterField>
}

function createInitialListFilterFormValues<TSortField extends string>(
  listPageState: ListPageState<TSortField>,
  listFilterFields: ReadonlyArray<ListFilterField>
): SearchFormValues {
  return Object.fromEntries(
    listFilterFields.map((listFilterField) => [
      listFilterField.name,
      listFilterField.name === listSearchParamNames.search
        ? listPageState.listQuery.search
        : listPageState.filterValues[listFilterField.name],
    ])
  )
}

export function ListFilterForm<TSortField extends string>({
  listPageState,
  listFilterFields,
}: ListFilterFormProps<TSortField>) {
  const router = useRouter()
  const [listFilterFormValues, setListFilterFormValues] = useState(() =>
    createInitialListFilterFormValues(listPageState, listFilterFields)
  )

  const updateListFilterFormValue = (fieldName: string, fieldValue: string) => {
    setListFilterFormValues({
      ...listFilterFormValues,
      [fieldName]: fieldValue,
    })
  }

  const getReversedDateRangeFieldLabel = (): string | null => {
    for (const listFilterField of listFilterFields) {
      if (
        listFilterField.kind !== ListFilterFieldKind.Date ||
        listFilterField.rangeStartFieldName === undefined
      ) {
        continue
      }
      const rangeStartDate =
        listFilterFormValues[listFilterField.rangeStartFieldName]
      const rangeEndDate = listFilterFormValues[listFilterField.name]
      if (
        rangeStartDate !== "" &&
        rangeEndDate !== "" &&
        rangeEndDate < rangeStartDate
      ) {
        return listFilterField.label
      }
    }
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const reversedDateRangeFieldLabel = getReversedDateRangeFieldLabel()
    if (reversedDateRangeFieldLabel !== null) {
      toast.error(
        `Поле «${reversedDateRangeFieldLabel}» не може бути раніше за початкову дату.`
      )
      return
    }

    const {
      [listSearchParamNames.search]: listSearchValue = "",
      ...listFilterValues
    } = listFilterFormValues
    router.push(
      createListPageHref(
        listPageState,
        { search: listSearchValue.trim(), page: firstListPage },
        listFilterValues
      )
    )
  }

  const handleReset = () => {
    router.push(
      createListPageHref(listPageState, { search: "", page: firstListPage }, {})
    )
  }

  const renderListFilterInput = (listFilterField: ListFilterField) => {
    const listFilterFieldValue = listFilterFormValues[listFilterField.name]
    switch (listFilterField.kind) {
      case ListFilterFieldKind.Text:
        return (
          <Input
            type="search"
            placeholder={listFilterField.placeholder}
            value={listFilterFieldValue}
            onChange={(event) =>
              updateListFilterFormValue(
                listFilterField.name,
                event.target.value
              )
            }
          />
        )
      case ListFilterFieldKind.Date:
        return (
          <Input
            type="date"
            value={listFilterFieldValue}
            onChange={(event) =>
              updateListFilterFormValue(
                listFilterField.name,
                event.target.value
              )
            }
          />
        )
      case ListFilterFieldKind.Select:
        return (
          <NativeSelect
            value={listFilterFieldValue}
            onChange={(event) =>
              updateListFilterFormValue(
                listFilterField.name,
                event.target.value
              )
            }
          >
            <option value="">{listFilterField.allOptionsLabel}</option>
            {listFilterField.options.map((listFilterOption) => (
              <option
                key={listFilterOption.value}
                value={listFilterOption.value}
              >
                {listFilterOption.label}
              </option>
            ))}
          </NativeSelect>
        )
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-4">
        {listFilterFields.map((listFilterField) => (
          <FormField key={listFilterField.name} label={listFilterField.label}>
            {renderListFilterInput(listFilterField)}
          </FormField>
        ))}
        <div className="flex items-end gap-2">
          <Button type="submit" className="flex-1">
            Знайти
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleReset}
          >
            Скинути
          </Button>
        </div>
      </div>
    </form>
  )
}
