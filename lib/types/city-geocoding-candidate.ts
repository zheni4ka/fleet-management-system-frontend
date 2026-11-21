import { z } from "zod"
import { cityGeocodingCandidateSchema } from "@/lib/schemas/city-geocoding-candidate-schema"

export type CityGeocodingCandidate = z.infer<
  typeof cityGeocodingCandidateSchema
>
