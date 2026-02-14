"use server"

import { getCurrentUser } from "@/lib/auth"
import { generateUserPhotoPathName } from "@/lib/utils"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeUserPhotoAction(
  userId: string,
  agencyId: string,
  photo: FileList,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      currentUser.userId !== userId) ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!photo[0]) {
    return
  }

  const file = photo[0]
  const uploadedPhoto = await uploadFile(
    file,
    generateUserPhotoPathName(userId, file),
  )
  const url = uploadedPhoto.path
  const user = await userServices.updateUserPhoto(userId, url)
  return user
}
