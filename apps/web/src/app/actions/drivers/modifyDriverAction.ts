"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateLicensePhotoPathName } from "@/lib/utils"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { ModifyDriverRequestType } from "@ryogo-travel-app/api/types/driver.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function modifyDriverAction(data: ModifyDriverRequestType) {
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

  if (!(await verifyCurrentUser())) {
    return
  }

  let licenseUrl

  // Upload files to Supabase Storage
  if (data.licensePhotos && data.licensePhotos[0]) {
    const license = data.licensePhotos[0]
    const uploadedFile = await uploadFile(
      license,
      generateLicensePhotoPathName(data.driverId, license),
    )
    licenseUrl = uploadedFile.path
  }

  const driver = await driverServices.modifyDriver(data, licenseUrl)
  if (!driver) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: driver.id,
    isFeed: true,
    textKey: "DriverModified",
    textObject: {
      driverName: driver.name,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${driver.id}`,
  })

  return driver
}
