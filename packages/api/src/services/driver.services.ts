import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { driverRepository } from "../repositories/driver.repo"
import { CreateDriverType } from "../types/driver.types"

export const driverServices = {
  //Get all drivers in an agency
  async findDriversByAgency(agencyId: string) {
    const drivers = await driverRepository.readAllDriversDataByAgencyId(
      agencyId
    )
    return drivers
  },

  //Create driver
  async addDriver(data: CreateDriverType) {
    //Step1: Check if driver (userId) already exists in the system
    const existingDriverUser = await driverRepository.readDriverByUserId(
      data.userId
    )
    if (existingDriverUser.length > 0) {
      throw new Error("Driver with same userId already exists ")
    }

    //Step2: Prepare vehicle types
    const input = data.canDriveVehicleTypes.map((x) => {
      return x.toLowerCase()
    })
    const canDrive = Object.values(VehicleTypesEnum).filter((x) =>
      input.includes(x.toString().toLowerCase() as string)
    )

    //Step3: Prepare driver data
    const newDriverData = {
      agencyId: data.agencyId,
      userId: data.userId,
      name: data.name,
      phone: data.phone,
      address: data.address,
      licenseNumber: data.licenseNumber,
      licenseExpiresOn: data.licenseExpiresOn,
      defaultAllowancePerDay: data.defaultAllowancePerDay,
      canDriveVehicleTypes: canDrive,
    }
    const newDriver = await driverRepository.createDriver(newDriverData)
    if (newDriver.length < 1) {
      throw new Error("Failed to create driver")
    }
    return newDriver[0]
  },

  //Upload driver license photo
  async updateDriverLicensePhoto(driverId: string, licenseUrl?: string) {
    const updatedDriver = await driverRepository.updateDriverLicenseUrl(
      driverId,
      licenseUrl
    )
    if (!updatedDriver || updatedDriver.length < 1) {
      throw new Error("Failed to update license url for this driver")
    }
    return updatedDriver[0]
  },
}

export type FindDriversByAgencyType = Awaited<
  ReturnType<typeof driverServices.findDriversByAgency>
>
