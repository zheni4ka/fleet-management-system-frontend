"use client"

import { useId, useState, type KeyboardEvent } from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { displayLocale } from "@/lib/constants"
import { SearchableSelectOption } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SearchableSelectProps {
  options: ReadonlyArray<SearchableSelectOption>
  selectedValue: string
  onSelectedValueChange: (selectedValue: string) => void
  placeholder: string
  searchPlaceholder: string
  emptyMessage: string
}

function getIsOptionMatchingSearchQuery(
  option: SearchableSelectOption,
  normalizedSearchQuery: string
): boolean {
  return option.label
    .toLocaleLowerCase(displayLocale)
    .includes(normalizedSearchQuery)
}

export function SearchableSelect({
  options,
  selectedValue,
  onSelectedValueChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
}: SearchableSelectProps) {
  const listboxId = useId()
  const optionIdPrefix = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [highlightedOptionValue, setHighlightedOptionValue] = useState<
    string | null
  >(null)

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  )
  const normalizedSearchQuery = searchQuery
    .trim()
    .toLocaleLowerCase(displayLocale)
  const visibleOptions = options.filter((option) =>
    getIsOptionMatchingSearchQuery(option, normalizedSearchQuery)
  )
  const enabledVisibleOptions = visibleOptions.filter(
    (option) => !option.isDisabled
  )

  const getOptionElementId = (optionValue: string) =>
    `${optionIdPrefix}-option-${optionValue}`

  const highlightOption = (optionValue: string | null) => {
    setHighlightedOptionValue(optionValue)
    if (optionValue !== null) {
      document
        .getElementById(getOptionElementId(optionValue))
        ?.scrollIntoView({ block: "nearest" })
    }
  }

  const handleOpenChange = (isPopoverOpen: boolean) => {
    setIsOpen(isPopoverOpen)
    if (isPopoverOpen) {
      setSearchQuery("")
      const isSelectedOptionEnabled =
        selectedOption !== undefined && !selectedOption.isDisabled
      setHighlightedOptionValue(
        isSelectedOptionEnabled
          ? selectedOption.value
          : (options.find((option) => !option.isDisabled)?.value ?? null)
      )
    }
  }

  const handleSearchQueryChange = (changedSearchQuery: string) => {
    setSearchQuery(changedSearchQuery)
    const changedNormalizedSearchQuery = changedSearchQuery
      .trim()
      .toLocaleLowerCase(displayLocale)
    setHighlightedOptionValue(
      options.find(
        (option) =>
          !option.isDisabled &&
          getIsOptionMatchingSearchQuery(option, changedNormalizedSearchQuery)
      )?.value ?? null
    )
  }

  const selectOption = (option: SearchableSelectOption) => {
    if (option.isDisabled) {
      return
    }
    onSelectedValueChange(option.value)
    setIsOpen(false)
  }

  const moveHighlight = (highlightStep: number) => {
    if (enabledVisibleOptions.length === 0) {
      return
    }
    const highlightedOptionIndex = enabledVisibleOptions.findIndex(
      (option) => option.value === highlightedOptionValue
    )
    const nextHighlightedOptionIndex =
      highlightedOptionIndex === -1
        ? 0
        : (highlightedOptionIndex +
            highlightStep +
            enabledVisibleOptions.length) %
          enabledVisibleOptions.length
    highlightOption(enabledVisibleOptions[nextHighlightedOptionIndex].value)
  }

  const handleSearchInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        moveHighlight(1)
        return
      case "ArrowUp":
        event.preventDefault()
        moveHighlight(-1)
        return
      case "Home":
        event.preventDefault()
        highlightOption(enabledVisibleOptions[0]?.value ?? null)
        return
      case "End":
        event.preventDefault()
        highlightOption(enabledVisibleOptions.at(-1)?.value ?? null)
        return
      case "Enter": {
        event.preventDefault()
        const highlightedOption = enabledVisibleOptions.find(
          (option) => option.value === highlightedOptionValue
        )
        if (highlightedOption !== undefined) {
          selectOption(highlightedOption)
        }
        return
      }
    }
  }

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          className="flex h-9 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-lg border border-input bg-white px-2.5 text-left text-sm font-normal text-gray-900 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span
            className={cn(
              "truncate",
              selectedOption === undefined && "text-muted-foreground"
            )}
          >
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronsUpDown
            aria-hidden="true"
            className="size-4 shrink-0 text-slate-500"
          />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Content
        align="start"
        sideOffset={4}
        className="z-50 w-(--radix-popover-trigger-width) min-w-56 rounded-lg border bg-white p-1 text-sm text-gray-900 shadow-lg outline-none"
      >
        <div className="flex items-center gap-2 border-b px-2 pb-1">
          <Search
            aria-hidden="true"
            className="size-4 shrink-0 text-slate-500"
          />
          <input
            autoFocus
            type="text"
            role="combobox"
            aria-expanded={true}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              highlightedOptionValue === null
                ? undefined
                : getOptionElementId(highlightedOptionValue)
            }
            aria-label={searchPlaceholder}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(event) => handleSearchQueryChange(event.target.value)}
            onKeyDown={handleSearchInputKeyDown}
            className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <ul
          id={listboxId}
          role="listbox"
          className="max-h-60 overflow-y-auto py-1"
        >
          {visibleOptions.length === 0 && (
            <li className="px-2 py-2 text-slate-500">{emptyMessage}</li>
          )}
          {visibleOptions.map((option) => {
            const isOptionSelected = option.value === selectedValue
            const isOptionHighlighted = option.value === highlightedOptionValue
            return (
              <li
                key={option.value}
                id={getOptionElementId(option.value)}
                role="option"
                aria-selected={isOptionSelected}
                aria-disabled={option.isDisabled}
                onPointerMove={() => {
                  if (!option.isDisabled) {
                    setHighlightedOptionValue(option.value)
                  }
                }}
                onClick={() => selectOption(option)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5",
                  isOptionHighlighted && "bg-slate-100",
                  option.isDisabled && "cursor-not-allowed text-slate-500"
                )}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate">{option.label}</span>
                  {option.disabledReason !== null && (
                    <span className="text-xs text-slate-500">
                      {option.disabledReason}
                    </span>
                  )}
                </span>
                {isOptionSelected && (
                  <Check aria-hidden="true" className="size-4 shrink-0" />
                )}
              </li>
            )
          })}
        </ul>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  )
}
