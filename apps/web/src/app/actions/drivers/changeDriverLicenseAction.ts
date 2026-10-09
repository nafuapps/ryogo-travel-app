"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateLicensePhotoPathName } from "@/lib/utils"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { ChangeDriverLicenseRequestType } from "@ryogo-travel-app/api/types/driver.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeDriverLicenseAction(
  data: ChangeDriverLicenseRequestType,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (UserRolesEnum.OWNER !== currentUser.userRole &&
      data.addedByUserId !== currentUser.userId) ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  let licensePhotoUrl

  // Upload files to Supabase Storage
  const [licenseFile] = data.licensePhotos || []
  if (licenseFile) {
    const uploadedFile = await uploadFile(
      licenseFile,
      generateLicensePhotoPathName(data.id, licenseFile),
    )
    licensePhotoUrl = uploadedFile.path
  }

  const driver = await driverServices.changeDriverLicense({
    ...data,
    licensePhotoUrl,
  })
  if (!driver) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: driver.id,
    isFeed: true,
    textKey: "DriverLicenseModified",
    textObject: {
      driverName: driver.name,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${driver.id}`,
  })

  return driver
}
