import { AutoStatus } from "./auto-status"

export interface Auto {
  id: number
  mark: string
  model: string
  color: string
  number: string
  capacity: number
  status: AutoStatus
}
