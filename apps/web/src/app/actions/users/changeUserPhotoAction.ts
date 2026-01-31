"use server"

import { generateUserPhotoPathName } from "@/lib/utils"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeUserPhotoAction(userId: string, photo: FileList) {
  if (photo && photo[0]) {
    const file = photo[0]
    const uploadedPhoto = await uploadFile(
      file,
      generateUserPhotoPathName(userId, file),
    )
    const url = uploadedPhoto!.path
    const user = await userServices.updateUserPhoto(userId, url)

    if (!user) return false
    return true
  } else {
    return false
  }
}
