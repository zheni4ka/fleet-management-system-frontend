import { CreateAutoMaintenanceRequestModel } from "./create-auto-maintenance-request-model"

export interface UpdateAutoMaintenanceRequestModel extends CreateAutoMaintenanceRequestModel {
  id: number
  isCompleted: boolean
}
