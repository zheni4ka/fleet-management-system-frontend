import { RouteScheduleFormValues } from "./route-schedule-form-values"
import { RouteStatus } from "./route-status"

export interface EditRouteFormValues extends RouteScheduleFormValues {
  status: RouteStatus
}
