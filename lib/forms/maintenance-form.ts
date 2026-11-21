import { getRequiredFieldErrors } from "@/lib/forms/form-field-errors"
import {
  AutoMaintenance,
  CreateAutoMaintenanceRequestModel,
  FormFieldErrors,
  FormValidationError,
  MaintenanceFormValues,
  UpdateAutoMaintenanceRequestModel,
} from "@/lib/types"

export function createEmptyMaintenanceFormValues(): MaintenanceFormValues {
  return { name: "", description: "", serviceDate: "", plannedEndDate: "" }
}

export function getMaintenanceFormFieldErrors(
  maintenanceFormValues: MaintenanceFormValues
): FormFieldErrors<keyof MaintenanceFormValues> {
  const requiredFieldErrors = getRequiredFieldErrors(maintenanceFormValues, [
    "name",
    "description",
    "serviceDate",
  ])
  const isPlannedEndNotAfterStart =
    maintenanceFormValues.serviceDate !== "" &&
    maintenanceFormValues.plannedEndDate !== "" &&
    maintenanceFormValues.plannedEndDate <= maintenanceFormValues.serviceDate
  return isPlannedEndNotAfterStart
    ? {
        ...requiredFieldErrors,
        plannedEndDate: FormValidationError.MaintenancePlannedEndNotAfterStart,
      }
    : requiredFieldErrors
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
