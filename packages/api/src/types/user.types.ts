import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"

export type CreateOwnerAccountRequestType = {
  agency: {
    businessEmail: string
    businessPhone: string
    businessName: string
    businessAddress: string
    agencyCity: string
    agencyState: string
    tryPremium: boolean
    commissionRate?: number
    logo?: File
    qrCode?: File
  }
  owner: {
    email: string
    phone: string
    name: string
    password: string
    photos?: File
    id?: string
  }
}

export type AddDriverRequestType = {
  agencyId: string
  addedByUserId: string
  name: string
  phone: string
  email: string
  licenseNumber?: string
  licenseExpiresOn?: Date
  address?: string
  canDriveVehicleTypes?: VehicleTypesEnum[]
  defaultAllowancePerDay?: number
  licensePhotos?: File
  userPhotos?: File
}

export type AddUserRequestType = {
  agencyId: string
  name: string
  phone: string
  email: string
  photos?: File
}
