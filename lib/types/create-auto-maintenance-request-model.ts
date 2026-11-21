export interface CreateAutoMaintenanceRequestModel {
  name: string
  description: string
  serviceDate: string
  plannedEndDate: string | null
  autoId: number
}
