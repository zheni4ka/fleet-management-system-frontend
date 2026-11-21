export enum FormValidationError {
  AutoCapacityNotPositive = "AutoCapacityNotPositive",
  SameStartAndDestinationLocation = "SameStartAndDestinationLocation",
  ArrivalNotAfterDeparture = "ArrivalNotAfterDeparture",
  RoutesPeriodDatesMissing = "RoutesPeriodDatesMissing",
  RoutesPeriodEndBeforeStart = "RoutesPeriodEndBeforeStart",
  DispatcherDepotsMissing = "DispatcherDepotsMissing",
  DepotNameMissing = "DepotNameMissing",
  MaintenancePlannedEndNotAfterStart = "MaintenancePlannedEndNotAfterStart",
  RequiredFieldMissing = "RequiredFieldMissing",
  EmailAddressInvalid = "EmailAddressInvalid",
  FormFieldsNeedAttention = "FormFieldsNeedAttention",
  PhoneNumberFormatInvalid = "PhoneNumberFormatInvalid",
}
