import { RouteScheduleFormValues } from "./route-schedule-form-values"
import { RouteStatus } from "./route-status"

export interface AddRouteFormValues extends RouteScheduleFormValues {
  status: RouteStatus
}
