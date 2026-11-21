import { DriverFormValues } from "./driver-form-values"

export interface DriverFormField {
  name: keyof DriverFormValues
  labelMessageKey: string
  hintMessageKey: string | null
}
