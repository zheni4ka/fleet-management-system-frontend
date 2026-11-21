"use client"

import { useId, useState, type KeyboardEvent } from "react"
import { useTranslations } from "next-intl"
import { Home, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAddressGeocodingSearch } from "@/hooks/use-address-geocoding-search"
import { addressGeocodingSearchConstraints } from "@/lib/constants"
import {
  AddressCandidate,
  RouteAddressSelection,
  RouteCitySelection,
} from "@/lib/types"
import { cn } from "@/lib/utils"

interface RouteAddressPickerProps {
  label: string
  routeCity: RouteCitySelection | null
  selectedAddress: RouteAddressSelection | null
  errorMessage?: string
  onSelectedAddressChange: (selectedAddress: RouteAddressSelection) => void
}

function formatAddressCandidateArea(
  addressCandidate: AddressCandidate
): string | null {
  const addressAreaParts = [
    addressCandidate.district,
    addressCandidate.postcode,
  ].filter((addressAreaPart) => addressAreaPart !== null)
  return addressAreaParts.length === 0 ? null : addressAreaParts.join(" · ")
}

export function RouteAddressPicker({
  label,
  routeCity,
  selectedAddress,
  errorMessage: fieldErrorMessage,
  onSelectedAddressChange,
}: RouteAddressPickerProps) {
  const routeTranslations = useTranslations("routes")
  const inputId = useId()
  const listboxId = useId()
  const optionIdPrefix = useId()
  const [isEditing, setIsEditing] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [highlightedOptionIndex, setHighlightedOptionIndex] = useState(0)
  const addressSearchArea =
    routeCity === null ||
    routeCity.latitude === null ||
    routeCity.longitude === null
      ? null
      : { latitude: routeCity.latitude, longitude: routeCity.longitude }
  const {
    isSearchTextLongEnough,
    isSearching,
    addressCandidates,
    errorMessage: searchErrorMessage,
  } = useAddressGeocodingSearch(searchText, addressSearchArea)

  const isSearchShown = selectedAddress === null || isEditing
  const isListboxShown = isSearchShown && addressCandidates.length > 0
  const highlightedAddressCandidate = addressCandidates.at(
    highlightedOptionIndex
  )

  const stopEditing = () => {
    setSearchText("")
    setIsEditing(false)
  }

  const selectAddressCandidate = (addressCandidate: AddressCandidate) => {
    onSelectedAddressChange({
      addressLine: addressCandidate.addressLine,
      latitude: addressCandidate.latitude,
      longitude: addressCandidate.longitude,
    })
    stopEditing()
  }

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && addressCandidates.length > 0) {
      event.preventDefault()
      setHighlightedOptionIndex(
        (highlightedOptionIndex + 1) % addressCandidates.length
      )
    } else if (event.key === "ArrowUp" && addressCandidates.length > 0) {
      event.preventDefault()
      setHighlightedOptionIndex(
        (highlightedOptionIndex - 1 + addressCandidates.length) %
          addressCandidates.length
      )
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (highlightedAddressCandidate !== undefined) {
        selectAddressCandidate(highlightedAddressCandidate)
      }
    } else if (event.key === "Escape" && selectedAddress !== null) {
      event.preventDefault()
      event.stopPropagation()
      stopEditing()
    }
  }

  const renderSearchStatus = () => {
    if (routeCity === null) {
      return routeTranslations("addressCityRequiredHint")
    }
    if (addressSearchArea === null) {
      return routeTranslations("addressCityCoordinatesMissingHint")
    }
    if (!isSearchTextLongEnough) {
      return searchText.trim() === ""
        ? null
        : routeTranslations("addressSearchHint", {
            minLength: addressGeocodingSearchConstraints.minLength,
          })
    }
    if (isSearching) {
      return routeTranslations("addressSearchLoading")
    }
    if (searchErrorMessage !== null) {
      return <span className="text-red-600">{searchErrorMessage}</span>
    }
    if (addressCandidates.length === 0) {
      return routeTranslations("addressSearchEmpty")
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
            disabled={addressSearchArea === null}
            value={searchText}
            maxLength={addressGeocodingSearchConstraints.maxLength}
            placeholder={routeTranslations("addressSearchPlaceholder")}
            onChange={(event) => {
              setSearchText(event.target.value)
              setHighlightedOptionIndex(0)
            }}
            onKeyDown={handleSearchKeyDown}
            onBlur={() => {
              if (selectedAddress !== null) {
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
              aria-label={routeTranslations("addressSearchResultsLabel")}
              className="absolute top-9 right-0 left-0 z-20 max-h-60 overflow-y-auto rounded-md border bg-white p-1 shadow-lg"
            >
              {addressCandidates.map(
                (addressCandidate, addressCandidateIndex) => {
                  const addressCandidateArea =
                    formatAddressCandidateArea(addressCandidate)
                  return (
                    <li
                      key={`${addressCandidate.addressLine}-${addressCandidate.latitude}-${addressCandidate.longitude}`}
                      id={`${optionIdPrefix}-${addressCandidateIndex}`}
                      role="option"
                      aria-selected={
                        addressCandidateIndex === highlightedOptionIndex
                      }
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() =>
                        setHighlightedOptionIndex(addressCandidateIndex)
                      }
                      onClick={() => selectAddressCandidate(addressCandidate)}
                      className={cn(
                        "flex cursor-pointer flex-col rounded-md px-2 py-1.5 font-normal",
                        addressCandidateIndex === highlightedOptionIndex &&
                          "bg-slate-100"
                      )}
                    >
                      <span className="font-medium text-slate-900">
                        {addressCandidate.addressLine}
                      </span>
                      {addressCandidateArea !== null && (
                        <span className="text-xs text-slate-500">
                          {addressCandidateArea}
                        </span>
                      )}
                    </li>
                  )
                }
              )}
            </ul>
          )}
        </div>
      ) : (
        <button
          id={inputId}
          type="button"
          onClick={() => {
            setSearchText("")
            setHighlightedOptionIndex(0)
            setIsEditing(true)
          }}
          aria-label={routeTranslations("changeAddressLabel", {
            addressLine: selectedAddress.addressLine,
          })}
          className="flex min-h-8 w-full cursor-pointer items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-left font-normal hover:bg-slate-50"
        >
          <Home aria-hidden="true" className="size-4 shrink-0 text-blue-600" />
          <span className="min-w-0 flex-1 truncate text-slate-900">
            {selectedAddress.addressLine}
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
