import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"

export type CreateOwnerAccountRequestType = {
  agency: {
    businessEmail: string
    businessPhone: string
    businessName: string
    businessAddress: string
    agencyCity: string
    agencyState: string
    commissionRate?: number | undefined
    logo?: FileList
  }
  owner: {
    email: string
    phone: string
    name: string
    password: string
    photos?: FileList
    id?: string
  }
}

export type AddDriverRequestType = {
  agencyId: string
  data: {
    name: string
    phone: string
    email: string
    licenseNumber: string
    licenseExpiresOn?: Date
    address: string
    canDriveVehicleTypes: VehicleTypesEnum[]
    defaultAllowancePerDay?: number | undefined
    licensePhotos?: FileList
    userPhotos?: FileList
  }
}

export type AddAgentRequestType = {
  agencyId: string
  data: {
    name: string
    phone: string
    email: string
    photos?: FileList
  }
}
