import { z } from "zod"

export const archivingDeleteResponseSchema = z.object({
  isArchivedInsteadOfDeleted: z.boolean(),
})
