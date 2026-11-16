import { commonUiTexts } from "@/lib/constants"

export class ConcurrencyConflictError extends Error {
  constructor() {
    super(commonUiTexts.concurrencyConflictMessage)
    this.name = "ConcurrencyConflictError"
  }
}
