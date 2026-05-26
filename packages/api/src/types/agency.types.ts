export type ModifyAgencyRequestType = {
  agencyId: string
  businessName?: string
  businessAddress?: string
  logo?: FileList
  defaultCommissionRate?: number
  agencyState?: string
  agencyCity?: string
}
