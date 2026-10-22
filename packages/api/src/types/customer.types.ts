export type NewCustomerRequestType = {
  name: string
  phone: string
  state: string
  city: string
  agencyId: string
  addedByUserId: string
  email?: string
  address?: string
  remarks?: string
  photo?: File
}
export type ModifyCustomerRequestType = {
  customerId: string
  agencyId: string
  name?: string
  email?: string
  address?: string
  remarks?: string
  state: string
  city: string
  locationId?: string
}
