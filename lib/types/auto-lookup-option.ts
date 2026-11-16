import { AutoStatus } from "./auto-status"

export interface AutoLookupOption {
  id: number
  mark: string
  model: string
  number: string
  status: AutoStatus
}
