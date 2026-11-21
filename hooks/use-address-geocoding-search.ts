"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useApiErrorMessageResolver } from "@/hooks/use-api-error-message-resolver"
import { fetchApiData } from "@/lib/api-client"
import {
  addressGeocodingSearchConstraints,
  apiEndpoints,
} from "@/lib/constants"
import { addressCandidatesSchema } from "@/lib/schemas/address-candidate-schema"
import { SessionExpiredError } from "@/lib/session-expired-error"
import { AddressCandidate, RouteAddressSelection } from "@/lib/types"

type AddressSearchArea = Pick<RouteAddressSelection, "latitude" | "longitude">

interface AddressSearchResult {
  searchKey: string
  addressCandidates: ReadonlyArray<AddressCandidate>
  errorMessage: string | null
}

function createAddressSearchApiPath(
  searchText: string,
  addressSearchArea: AddressSearchArea
): string {
  const addressSearchParams = new URLSearchParams({
    searchText,
    latitude: String(addressSearchArea.latitude),
    longitude: String(addressSearchArea.longitude),
  })
  return `${apiEndpoints.searchAddressCandidates}?${addressSearchParams.toString()}`
}

export function useAddressGeocodingSearch(
  searchText: string,
  addressSearchArea: AddressSearchArea | null
) {
  const routeTranslations = useTranslations("routes")
  const resolveApiErrorMessage = useApiErrorMessageResolver()
  const [addressSearchResult, setAddressSearchResult] =
    useState<AddressSearchResult | null>(null)

  const trimmedSearchText = searchText.trim()
  const isSearchTextLongEnough =
    trimmedSearchText.length >= addressGeocodingSearchConstraints.minLength
  const canSearch = isSearchTextLongEnough && addressSearchArea !== null
  const searchKey =
    addressSearchArea === null
      ? ""
      : createAddressSearchApiPath(trimmedSearchText, addressSearchArea)
  const currentAddressSearchResult =
    canSearch && addressSearchResult?.searchKey === searchKey
      ? addressSearchResult
      : null

  useEffect(() => {
    if (!canSearch) {
      return
    }
    let isSearchStale = false
    const searchTimeoutId = window.setTimeout(async () => {
      try {
        const addressCandidates = await fetchApiData(
          searchKey,
          addressCandidatesSchema
        )
        if (!isSearchStale) {
          setAddressSearchResult({
            searchKey,
            addressCandidates,
            errorMessage: null,
          })
        }
      } catch (error) {
        if (isSearchStale || error instanceof SessionExpiredError) {
          return
        }
        setAddressSearchResult({
          searchKey,
          addressCandidates: [],
          errorMessage: resolveApiErrorMessage(
            error,
            routeTranslations("addressSearchError")
          ),
        })
      }
    }, addressGeocodingSearchConstraints.debounceDelayInMilliseconds)
    return () => {
      isSearchStale = true
      window.clearTimeout(searchTimeoutId)
    }
    // The resolver and translator are recreated on every render; only a new search key restarts the search.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, canSearch])

  return {
    isSearchTextLongEnough,
    isSearching: canSearch && currentAddressSearchResult === null,
    addressCandidates: currentAddressSearchResult?.addressCandidates ?? [],
    errorMessage: currentAddressSearchResult?.errorMessage ?? null,
  }
}
