import { sessionExpiredMessage } from "@/lib/constants"

export class SessionExpiredError extends Error {
  constructor() {
    super(sessionExpiredMessage)
    this.name = "SessionExpiredError"
  }
}
