import { z } from "zod"

export const cityGeocodingCandidateSchema = z.object({
  geoNamesId: z.number().int().positive(),
  city: z.string().min(1),
  region: z.string().nullable(),
  country: z.string().min(1),
  countryCode: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timeZoneId: z.string().min(1),
  population: z.number().int().nullable(),
})

export const cityGeocodingCandidatesSchema = z.array(
  cityGeocodingCandidateSchema
)
