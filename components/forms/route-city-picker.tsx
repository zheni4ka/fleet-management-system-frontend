"use client"

import { useId, useState, type KeyboardEvent } from "react"
import { useTranslations } from "next-intl"
import { MapPin, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCityGeocodingSearch } from "@/hooks/use-city-geocoding-search"
import { cityGeocodingSearchConstraints } from "@/lib/constants"
import { formatMapCoordinates } from "@/lib/formatters"
import {
  createRouteCitySelectionFromCandidate,
  formatCityCandidateArea,
  formatRouteCitySelection,
} from "@/lib/forms/route-city-selection"
import { CityGeocodingCandidate, RouteCitySelection } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RouteCityPickerProps {
  label: string
  placeholder: string
  selectedCity: RouteCitySelection | null
  errorMessage?: string
  onSelectedCityChange: (selectedCity: RouteCitySelection) => void
}

export function RouteCityPicker({
  label,
  placeholder,
  selectedCity,
  errorMessage: fieldErrorMessage,
  onSelectedCityChange,
}: RouteCityPickerProps) {
  const routeTranslations = useTranslations("routes")
  const inputId = useId()
  const listboxId = useId()
  const optionIdPrefix = useId()
  const [isEditing, setIsEditing] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [highlightedOptionIndex, setHighlightedOptionIndex] = useState(0)
  const { isSearchTextLongEnough, isSearching, cityCandidates, errorMessage } =
    useCityGeocodingSearch(searchText)

  const isSearchShown = selectedCity === null || isEditing
  const isListboxShown = isSearchShown && cityCandidates.length > 0
  const highlightedCityCandidate = cityCandidates.at(highlightedOptionIndex)

  const startEditing = () => {
    setSearchText("")
    setHighlightedOptionIndex(0)
    setIsEditing(true)
  }

  const stopEditing = () => {
    setSearchText("")
    setIsEditing(false)
  }

  const selectCityCandidate = (cityCandidate: CityGeocodingCandidate) => {
    onSelectedCityChange(createRouteCitySelectionFromCandidate(cityCandidate))
    stopEditing()
  }

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && cityCandidates.length > 0) {
      event.preventDefault()
      setHighlightedOptionIndex(
        (highlightedOptionIndex + 1) % cityCandidates.length
      )
    } else if (event.key === "ArrowUp" && cityCandidates.length > 0) {
      event.preventDefault()
      setHighlightedOptionIndex(
        (highlightedOptionIndex - 1 + cityCandidates.length) %
          cityCandidates.length
      )
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (highlightedCityCandidate !== undefined) {
        selectCityCandidate(highlightedCityCandidate)
      }
    } else if (event.key === "Escape" && selectedCity !== null) {
      event.preventDefault()
      event.stopPropagation()
      stopEditing()
    }
  }

  const renderSearchStatus = () => {
    if (!isSearchTextLongEnough) {
      return searchText.trim() === ""
        ? null
        : routeTranslations("citySearchHint", {
            minLength: cityGeocodingSearchConstraints.minLength,
          })
    }
    if (isSearching) {
      return routeTranslations("citySearchLoading")
    }
    if (errorMessage !== null) {
      return <span className="text-red-600">{errorMessage}</span>
    }
    if (cityCandidates.length === 0) {
      return routeTranslations("citySearchEmpty")
    }
    return null
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-1 text-sm font-medium text-slate-700",
        fieldErrorMessage !== undefined &&
          "[&_button]:border-red-500 [&_input]:border-red-500"
      )}
    >
      <label htmlFor={inputId}>
        {label}
        <span aria-hidden="true" className="ml-0.5 text-red-600">
          *
        </span>
      </label>
      {isSearchShown ? (
        <div className="relative">
          <Input
            id={inputId}
            type="text"
            role="combobox"
            aria-expanded={isListboxShown}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              isListboxShown
                ? `${optionIdPrefix}-${highlightedOptionIndex}`
                : undefined
            }
            autoComplete="off"
            autoFocus={isEditing}
            value={searchText}
            maxLength={cityGeocodingSearchConstraints.maxLength}
            placeholder={placeholder}
            onChange={(event) => {
              setSearchText(event.target.value)
              setHighlightedOptionIndex(0)
            }}
            onKeyDown={handleSearchKeyDown}
            onBlur={() => {
              if (selectedCity !== null) {
                stopEditing()
              }
            }}
          />
          <div
            aria-live="polite"
            className="mt-1 min-h-4 text-xs font-normal text-slate-500"
          >
            {renderSearchStatus()}
          </div>
          {isListboxShown && (
            <ul
              id={listboxId}
              role="listbox"
              aria-label={routeTranslations("citySearchResultsLabel")}
              className="absolute top-9 right-0 left-0 z-20 max-h-60 overflow-y-auto rounded-md border bg-white p-1 shadow-lg"
            >
              {cityCandidates.map((cityCandidate, cityCandidateIndex) => (
                <li
                  key={cityCandidate.geoNamesId}
                  id={`${optionIdPrefix}-${cityCandidateIndex}`}
                  role="option"
                  aria-selected={cityCandidateIndex === highlightedOptionIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() =>
                    setHighlightedOptionIndex(cityCandidateIndex)
                  }
                  onClick={() => selectCityCandidate(cityCandidate)}
                  className={cn(
                    "flex cursor-pointer flex-col rounded-md px-2 py-1.5 font-normal",
                    cityCandidateIndex === highlightedOptionIndex &&
                      "bg-slate-100"
                  )}
                >
                  <span className="font-medium text-slate-900">
                    {cityCandidate.city}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatCityCandidateArea(cityCandidate)} ·{" "}
                    {formatMapCoordinates(cityCandidate)} ·{" "}
                    {cityCandidate.timeZoneId}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <button
          id={inputId}
          type="button"
          onClick={startEditing}
          aria-label={routeTranslations("changeCityLabel", {
            cityName: formatRouteCitySelection(selectedCity),
          })}
          className="flex min-h-8 w-full cursor-pointer items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-left font-normal hover:bg-slate-50"
        >
          <MapPin
            aria-hidden="true"
            className="size-4 shrink-0 text-blue-600"
          />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-slate-900">
              {formatRouteCitySelection(selectedCity)}
            </span>
            <span className="text-xs text-slate-500">
              {selectedCity.timeZoneId}
            </span>
          </span>
          <Pencil
            aria-hidden="true"
            className="size-3.5 shrink-0 text-slate-400"
          />
        </button>
      )}
      {fieldErrorMessage !== undefined && (
        <p role="alert" className="text-xs font-medium text-red-600">
          {fieldErrorMessage}
        </p>
      )}
    </div>
  )
}

export default RouteCityPicker
