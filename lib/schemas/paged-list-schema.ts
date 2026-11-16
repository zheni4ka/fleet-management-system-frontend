import { z } from "zod"

export function createPagedListSchema<TItemSchema extends z.ZodType>(
  itemSchema: TItemSchema
) {
  return z.object({
    items: z.array(itemSchema),
    totalCount: z.number().int(),
  })
}
