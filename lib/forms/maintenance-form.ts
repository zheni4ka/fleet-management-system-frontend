import {
  AutoMaintenance,
  CreateAutoMaintenanceRequestModel,
  MaintenanceFormValues,
  UpdateAutoMaintenanceRequestModel,
} from "@/lib/types"

export function createEmptyMaintenanceFormValues(): MaintenanceFormValues {
  return { name: "", description: "", serviceDate: "" }
}

export function getMaintenanceFormValidationError(
  maintenanceFormValues: MaintenanceFormValues
): string | null {
  const hasEmptyRequiredField = Object.values(maintenanceFormValues).some(
    (maintenanceFieldValue) => maintenanceFieldValue.trim() === ""
  )
  if (hasEmptyRequiredField) {
    return "Заповніть всі поля!"
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
    autoId,
  }
}

export function createCompleteAutoMaintenanceRequestModel(
  autoMaintenance: AutoMaintenance
): UpdateAutoMaintenanceRequestModel {
  return {
    id: autoMaintenance.id,
    name: autoMaintenance.name,
    description: autoMaintenance.description,
    serviceDate: autoMaintenance.serviceDate,
    autoId: autoMaintenance.autoId,
    isCompleted: true,
  }
}
