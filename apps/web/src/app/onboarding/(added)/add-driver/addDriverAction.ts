"use server"

import { updateSessionUserStatus } from "@/lib/session"
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
    const agency = await agencyServices.activateAgency(data.agencyId)
    //Update status in session cookie
    await updateSessionUserStatus(UserStatusEnum.ACTIVE)
  }

  if (driver.id) {
    if (data.data.licensePhotos && data.data.licensePhotos[0]) {
      const license = data.data.licensePhotos[0]
      const fileName = `${Date.now()}-${license.name}`
      const uploadedLicense = await uploadFile(
        license,
        `${driver.id}/license/${fileName}`,
      )
      const url = uploadedLicense!.path
      await driverServices.updateDriverLicensePhoto(driver.id, url)
    }
    if (data.data.userPhotos && data.data.userPhotos[0]) {
      const photo = data.data.userPhotos[0]
      const fileName = `${Date.now()}-${photo.name}`
      const uploadedPhoto = await uploadFile(
        photo,
        `${driver.userId}/photo/${fileName}`,
      )
      const url = uploadedPhoto!.path
      await userServices.updateUserPhoto(driver.userId, url)
    }
  }
  return driver
}
