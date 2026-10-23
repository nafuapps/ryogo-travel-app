"use server"

import { writePermissions } from "@/lib/permissions"
import { generateLicensePhotoPathName } from "@/lib/utils"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { ChangeDriverLicenseRequestType } from "@ryogo-travel-app/api/types/driver.types"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeDriverLicenseAction(
  data: ChangeDriverLicenseRequestType,
) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId: data.agencyId,
    assignedUserId: data.addedByUserId,
  })
  if (!currentUser) return

  let licensePhotoUrl

  // Upload files to Supabase Storage
  const licenseFile = data.licensePhotos
  if (licenseFile) {
    const uploadedFile = await uploadFile(
      licenseFile,
      generateLicensePhotoPathName(data.id),
    )
    licensePhotoUrl = uploadedFile.path
  }

  const changedDriver = await driverServices.changeDriverLicense({
    ...data,
    licensePhotoUrl,
  })
  if (!changedDriver) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: changedDriver.id,
    isFeed: true,
    textKey: "DriverLicenseModified",
    textObject: {
      driverName: changedDriver.name,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${changedDriver.id}`,
  })

  return changedDriver
}
