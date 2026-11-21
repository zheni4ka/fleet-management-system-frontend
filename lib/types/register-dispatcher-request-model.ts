import { UserRole } from "./user-role"

export interface RegisterDispatcherRequestModel {
  username: string
  email: string
  password: string
  role: UserRole
  depotIds: ReadonlyArray<number>
}
