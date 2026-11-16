import { z } from "zod"

export const apiProblemTypeSchema = z.object({
  type: z.string().optional(),
})
