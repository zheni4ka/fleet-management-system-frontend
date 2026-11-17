export class ConcurrencyConflictError extends Error {
  constructor() {
    super("The record was changed by another user.")
    this.name = "ConcurrencyConflictError"
  }
}
