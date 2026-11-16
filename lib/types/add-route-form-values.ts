import { RouteAssignmentFormValues } from "./route-assignment-form-values"
import { RouteStatus } from "./route-status"

export interface AddRouteFormValues extends RouteAssignmentFormValues {
  departureLocalDateTime: string
  arrivalLocalDateTime: string
  status: RouteStatus
}
