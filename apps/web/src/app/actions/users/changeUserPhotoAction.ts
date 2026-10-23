"use server"

import { writePermissions } from "@/lib/permissions"
import { generateUserPhotoPathName } from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeUserPhotoAction({
  userId,
  agencyId,
  photo,
}: {
  userId: string
  agencyId: string
  photo: File
}) {
  const currentUser = await writePermissions.allowDashboardUserOrAssignedUser({
    agencyId,
    assignedUserId: userId,
  })
  if (!currentUser) return

  const uploadedPhoto = await uploadFile(
    photo,
    generateUserPhotoPathName(userId),
  )
  const changedUser = await userServices.updateUserPhoto({
    userId,
    photoUrl: uploadedPhoto.path,
  })
  if (!changedUser) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.USER,
    entityId: changedUser.id,
    isFeed: true,
    textKey: "UserPhotoChanged",
    textObject: {
      userName: changedUser.name,
    },
  })

  return changedUser
}
