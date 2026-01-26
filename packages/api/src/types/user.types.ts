import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"

// /api/auth/login (POST)
export type LoginAPIResponseType = {
  id: string
}[]

// /api/auth/signup (POST)
export type SignupAPIResponseType = {
  id: string
}[]

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
  }
}

export type AddDriverRequestType = {
  agencyId: string
  ownerId?: string
  data: {
    name: string
    phone: string
    email: string
    licenseNumber: string
    licenseExpiresOn: Date
    address: string
    canDriveVehicleTypes: VehicleTypesEnum[]
    defaultAllowancePerDay?: number | undefined
    licensePhotos?: FileList
    userPhotos?: FileList
  }
}

export type AddAgentRequestType = {
  agencyId: string
  ownerId?: string
  data: {
    name: string
    phone: string
    email: string
    photos?: FileList
  }
}
