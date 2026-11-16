import { z } from "zod"

export const singleSignOnTransactionSchema = z.object({
  state: z.string().min(1),
  nonce: z.string().min(1),
  codeVerifier: z.string().min(1),
  returnPath: z.string().min(1),
})
