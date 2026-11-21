import { z } from "zod"
import { addressCandidateSchema } from "@/lib/schemas/address-candidate-schema"

export type AddressCandidate = z.infer<typeof addressCandidateSchema>
