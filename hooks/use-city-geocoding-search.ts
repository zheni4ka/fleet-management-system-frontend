"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useApiErrorMessageResolver } from "@/hooks/use-api-error-message-resolver"
import { fetchApiData } from "@/lib/api-client"
import { apiEndpoints, cityGeocodingSearchConstraints } from "@/lib/constants"
import { cityGeocodingCandidatesSchema } from "@/lib/schemas/city-geocoding-candidate-schema"
import { SessionExpiredError } from "@/lib/session-expired-error"
import { CityGeocodingCandidate } from "@/lib/types"

interface CitySearchResult {
  searchText: string
  cityCandidates: ReadonlyArray<CityGeocodingCandidate>
  errorMessage: string | null
}

function createCitySearchApiPath(searchText: string): string {
  const citySearchParams = new URLSearchParams({ searchText })
  return `${apiEndpoints.searchCityGeocodingCandidates}?${citySearchParams.toString()}`
}

export function useCityGeocodingSearch(searchText: string) {
  const routeTranslations = useTranslations("routes")
  const resolveApiErrorMessage = useApiErrorMessageResolver()
  const [citySearchResult, setCitySearchResult] =
    useState<CitySearchResult | null>(null)

  const trimmedSearchText = searchText.trim()
  const isSearchTextLongEnough =
    trimmedSearchText.length >= cityGeocodingSearchConstraints.minLength
  const currentCitySearchResult =
    isSearchTextLongEnough && citySearchResult?.searchText === trimmedSearchText
      ? citySearchResult
      : null

  useEffect(() => {
    if (!isSearchTextLongEnough) {
      return
    }
    let isSearchStale = false
    const searchTimeoutId = window.setTimeout(async () => {
      try {
        const cityCandidates = await fetchApiData(
          createCitySearchApiPath(trimmedSearchText),
          cityGeocodingCandidatesSchema
        )
        if (!isSearchStale) {
          setCitySearchResult({
            searchText: trimmedSearchText,
            cityCandidates,
            errorMessage: null,
          })
        }
      } catch (error) {
        if (isSearchStale || error instanceof SessionExpiredError) {
          return
        }
        setCitySearchResult({
          searchText: trimmedSearchText,
          cityCandidates: [],
          errorMessage: resolveApiErrorMessage(
            error,
            routeTranslations("citySearchError")
          ),
        })
      }
    }, cityGeocodingSearchConstraints.debounceDelayInMilliseconds)
    return () => {
      isSearchStale = true
      window.clearTimeout(searchTimeoutId)
    }
    // The resolver and translator are recreated on every render; only a new search text restarts the search.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmedSearchText, isSearchTextLongEnough])

  return {
    isSearchTextLongEnough,
    isSearching: isSearchTextLongEnough && currentCitySearchResult === null,
    cityCandidates: currentCitySearchResult?.cityCandidates ?? [],
    errorMessage: currentCitySearchResult?.errorMessage ?? null,
  }
}
