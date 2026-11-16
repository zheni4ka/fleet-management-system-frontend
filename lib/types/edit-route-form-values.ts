import { RouteAssignmentFormValues } from "./route-assignment-form-values"
import { RouteStatus } from "./route-status"

export interface EditRouteFormValues extends RouteAssignmentFormValues {
  status: RouteStatus
}
