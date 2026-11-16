import { z } from "zod"

export const oidcDiscoveryDocumentSchema = z.object({
  authorization_endpoint: z.url(),
  token_endpoint: z.url(),
})
