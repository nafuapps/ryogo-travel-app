"use server"

import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import {
  NewDriverResponseType,
  NewDriverRequestType,
} from "@ryogo-travel-app/api/types/driver.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function newDriverAction(data: NewDriverRequestType) {
  const driver: NewDriverResponseType = await driverServices.addNewDriver(data)

  if (driver.id) {
    if (data.data.licensePhotos && data.data.licensePhotos[0]) {
      const license = data.data.licensePhotos[0]
      const fileName = `${Date.now()}-${license.name}`
      const uploadedLicense = await uploadFile(
        license,
        `${driver.id}/license/${fileName}`
      )
      const url = uploadedLicense!.path
      await driverServices.updateDriverLicensePhoto(driver.id, url)
    }
    if (data.data.driverPhotos && data.data.driverPhotos[0]) {
      const photo = data.data.driverPhotos[0]
      const fileName = `${Date.now()}-${photo.name}`
      const uploadedLicense = await uploadFile(
        photo,
        `${driver.id}/license/${fileName}`
      )
      const url = uploadedLicense!.path
      await userServices.updateUserPhoto(driver.userId, url)
    }
  }
  return driver
}
