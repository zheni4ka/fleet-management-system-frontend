import { z } from "zod"

export const depotSchema = z.object({
  id: z.number().int(),
  name: z.string(),
})

export const depotsSchema = z.array(depotSchema)
