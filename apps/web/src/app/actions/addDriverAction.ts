"use server"

import { updateSessionUserStatus } from "@/lib/session"
import {
  generateLicensePhotoPathName,
  generateUserPhotoPathName,
} from "@/lib/utils"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function addDriverAction(data: AddDriverRequestType) {
  const driver = await userServices.addDriverUser(data)

  if (data.ownerId) {
    //Activate owner account
    await userServices.activateUser(data.ownerId)
    //Activate agency
    await agencyServices.activateAgency(data.agencyId)
    //Update status in session cookie
    await updateSessionUserStatus(UserStatusEnum.ACTIVE)
  }

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
