export enum FormValidationError {
  AutoRequiredFieldsMissing = "AutoRequiredFieldsMissing",
  AutoCapacityNotPositive = "AutoCapacityNotPositive",
  DriverRequiredFieldsMissing = "DriverRequiredFieldsMissing",
  MaintenanceRequiredFieldsMissing = "MaintenanceRequiredFieldsMissing",
  RouteRequiredFieldsMissing = "RouteRequiredFieldsMissing",
  SameStartAndDestinationLocation = "SameStartAndDestinationLocation",
  ArrivalNotAfterDeparture = "ArrivalNotAfterDeparture",
  RoutesPeriodDatesMissing = "RoutesPeriodDatesMissing",
  RoutesPeriodEndBeforeStart = "RoutesPeriodEndBeforeStart",
  DispatcherDepotsMissing = "DispatcherDepotsMissing",
  DepotNameMissing = "DepotNameMissing",
}
