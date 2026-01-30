"use server"

import {
  generateLicensePhotoPathName,
  generateUserPhotoPathName,
} from "@/lib/utils"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function newDriverAction(data: AddDriverRequestType) {
  const driver = await userServices.addDriverUser(data)

  if (driver.id) {
    if (data.data.licensePhotos && data.data.licensePhotos[0]) {
      const license = data.data.licensePhotos[0]
      const uploadedLicense = await uploadFile(
        license,
        generateLicensePhotoPathName(driver.id, license),
      )
      await driverServices.updateDriverLicensePhoto(
        driver.id,
        uploadedLicense.path,
      )
    }
    if (data.data.userPhotos && data.data.userPhotos[0]) {
      const photo = data.data.userPhotos[0]
      const uploadedPhoto = await uploadFile(
        photo,
        generateUserPhotoPathName(driver.userId, photo),
      )
      await userServices.updateUserPhoto(driver.userId, uploadedPhoto.path)
    }
  }
  return driver
}
