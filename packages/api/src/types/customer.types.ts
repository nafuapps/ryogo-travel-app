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
  photo?: FileList
}
