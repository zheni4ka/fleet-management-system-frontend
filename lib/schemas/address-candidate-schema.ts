import { z } from "zod"

export const addressCandidateSchema = z.object({
  addressLine: z.string().min(1),
  district: z.string().nullable(),
  postcode: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
})

export const addressCandidatesSchema = z.array(addressCandidateSchema)
