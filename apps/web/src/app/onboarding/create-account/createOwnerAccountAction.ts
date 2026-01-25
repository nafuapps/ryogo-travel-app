"use server"

import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { OnboardingCreateAccountAPIRequestType } from "@ryogo-travel-app/api/types/user.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function createOwnerAccountAction(
  data: OnboardingCreateAccountAPIRequestType,
) {
  const user = await userServices.addAgencyAndOwnerAccount(data)

  if (data.agency.logo && data.agency.logo[0]) {
    const logo = data.agency.logo[0]
    const fileName = `${Date.now()}-${logo.name}`
    // Upload to Supabase Storage
    const uploadData = await uploadFile(logo, `${fileName}/logo/${fileName}`)
    await agencyServices.updateAgencyLogo(user.agencyId, uploadData.path)
  }
  if (data.owner.photos && data.owner.photos[0]) {
    const photo = data.owner.photos[0]
    const fileName = `${Date.now()}-${photo.name}`
    const uploadedPhoto = await uploadFile(
      photo,
      `${user.userId}/photo/${fileName}`,
    )
    const url = uploadedPhoto!.path
    await userServices.updateUserPhoto(user.userId, url)
  }

  return user
}
