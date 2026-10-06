"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateUserPhotoPathName } from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeUserPhotoAction({
  userId,
  agencyId,
  photo,
}: {
  userId: string
  agencyId: string
  photo: FileList
}) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.agencyId !== agencyId ||
    (![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) &&
      currentUser.userId !== userId)
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const [file] = photo
  if (!file) return
  const uploadedPhoto = await uploadFile(
    file,
    generateUserPhotoPathName(userId, file),
  )
  const user = await userServices.updateUserPhoto({
    userId,
    photoUrl: uploadedPhoto.path,
  })
  if (!user) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.USER,
    entityId: user.id,
    isFeed: true,
    textKey: "UserPhotoChanged",
    textObject: {
      userName: user.name,
    },
  })

  return user
}
