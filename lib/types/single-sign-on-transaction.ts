import { z } from "zod"
import { singleSignOnTransactionSchema } from "@/lib/schemas/single-sign-on-transaction-schema"

export type SingleSignOnTransaction = z.infer<
  typeof singleSignOnTransactionSchema
>
