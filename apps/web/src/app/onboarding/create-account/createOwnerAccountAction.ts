"use server"

import {
  generateAgencyLogoPathName,
  generateUserPhotoPathName,
} from "@/lib/utils"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function createOwnerAccountAction(
  data: CreateOwnerAccountRequestType,
) {
  const user = await userServices.addAgencyAndOwnerAccount(data)

  if (data.agency.logo && data.agency.logo[0]) {
    const logo = data.agency.logo[0]
    // Upload to Supabase Storage
    const uploadData = await uploadFile(
      logo,
      generateAgencyLogoPathName(user.agencyId, logo),
    )
    await agencyServices.updateAgencyLogo(user.agencyId, uploadData.path)
  }
  if (data.owner.photos && data.owner.photos[0]) {
    const photo = data.owner.photos[0]
    const uploadedPhoto = await uploadFile(
      photo,
      generateUserPhotoPathName(user.userId, photo),
    )
    const url = uploadedPhoto!.path
    await userServices.updateUserPhoto(user.userId, url)
  }

  return user
}
