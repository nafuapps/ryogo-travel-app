export type CreateAgencyType = {
  businessName: string
  businessPhone: string
  businessEmail: string
  businessAddress: string
  commissionRate?: number
  agencyState: string
  agencyCity: string
}

export type ModifyAgencyRequestType = {
  agencyId: string
  businessName?: string
  businessAddress?: string
  logo?: FileList
  defaultCommissionRate?: number
  agencyState?: string
  agencyCity?: string
}
