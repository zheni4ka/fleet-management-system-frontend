import {
  AutoMaintenance,
  CreateAutoMaintenanceRequestModel,
  FormValidationError,
  MaintenanceFormValues,
  UpdateAutoMaintenanceRequestModel,
} from "@/lib/types"

export function createEmptyMaintenanceFormValues(): MaintenanceFormValues {
  return { name: "", description: "", serviceDate: "", plannedEndDate: "" }
}

export function getMaintenanceFormValidationError(
  maintenanceFormValues: MaintenanceFormValues
): FormValidationError | null {
  const requiredMaintenanceFieldValues = [
    maintenanceFormValues.name,
    maintenanceFormValues.description,
    maintenanceFormValues.serviceDate,
  ]
  const hasEmptyRequiredField = requiredMaintenanceFieldValues.some(
    (maintenanceFieldValue) => maintenanceFieldValue.trim() === ""
  )
  if (hasEmptyRequiredField) {
    return FormValidationError.MaintenanceRequiredFieldsMissing
  }
  const hasPlannedEndDate = maintenanceFormValues.plannedEndDate !== ""
  if (
    hasPlannedEndDate &&
    maintenanceFormValues.plannedEndDate <= maintenanceFormValues.serviceDate
  ) {
    return FormValidationError.MaintenancePlannedEndNotAfterStart
  }
  return null
}

export function createCreateAutoMaintenanceRequestModel(
  autoId: number,
  maintenanceFormValues: MaintenanceFormValues
): CreateAutoMaintenanceRequestModel {
  return {
    name: maintenanceFormValues.name.trim(),
    description: maintenanceFormValues.description.trim(),
    serviceDate: maintenanceFormValues.serviceDate,
    plannedEndDate:
      maintenanceFormValues.plannedEndDate === ""
        ? null
        : maintenanceFormValues.plannedEndDate,
    autoId,
  }
}

export function createCompleteAutoMaintenanceRequestModel(
  autoMaintenance: AutoMaintenance
): UpdateAutoMaintenanceRequestModel {
  return {
    id: autoMaintenance.id,
    rowVersion: autoMaintenance.rowVersion,
    name: autoMaintenance.name,
    description: autoMaintenance.description,
    serviceDate: autoMaintenance.serviceDate,
    plannedEndDate: autoMaintenance.plannedEndDate,
    autoId: autoMaintenance.autoId,
    isCompleted: true,
  }
}
