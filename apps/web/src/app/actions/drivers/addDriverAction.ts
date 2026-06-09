"use server"

import { AddDriverEmailTemplate } from "@/components/email/addDriverEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { getCurrentUser } from "@/lib/auth"
import {
  generateLicensePhotoPathName,
  generateUserPhotoPathName,
} from "@/lib/utils"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"
import { headers } from "next/headers"

export async function addDriverAction(data: AddDriverRequestType) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }
  const driver = await userServices.addDriverUser(data)
  if (!driver) return

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

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: driver.id,
    isFeed: true,
    textKey: "DriverAdded",
    textObject: {
      driverName: driver.name,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${driver.id}`,
  })

  const headerList = await headers()
  const host = headerList.get("host")
  const protocol = headerList.get("x-forwarded-proto") || "http"
  const absoluteUrl = `${protocol}://${host}/auth/login/password/${driver.userId}`

  //Send password in email to the driver
  sendEmail(
    [driver.email],
    "Welcome to RyoGo",
    AddDriverEmailTemplate({
      name: driver.name,
      password: driver.password,
      link: absoluteUrl,
    }),
  )

  return driver
}
