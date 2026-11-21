export interface CreateDriverRequestModel {
  name: string
  surname: string
  patronymic: string
  licenseNumber: string
  phoneNumber: string | null
  email: string | null
  depotId: number
}
