import { commonUiTexts } from "@/lib/constants"

export class SessionExpiredError extends Error {
  constructor() {
    super(commonUiTexts.sessionExpiredMessage)
    this.name = "SessionExpiredError"
  }
}
