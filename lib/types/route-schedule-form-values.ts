import { RouteAssignmentFormValues } from "./route-assignment-form-values"

export interface RouteScheduleFormValues extends RouteAssignmentFormValues {
  departureLocalDateTime: string
  arrivalLocalDateTime: string
}
