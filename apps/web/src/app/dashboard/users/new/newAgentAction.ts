"use server"

import { generateUserPhotoPathName } from "@/lib/utils"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function newAgentAction({ agencyId, data }: AddAgentRequestType) {
  const agent = await userServices.addAgentUser({ agencyId, data })
  console.log({ agent })
  if (agent.id && data.photos && data.photos[0]) {
    const photo = data.photos[0]
    const uploadedPhoto = await uploadFile(
      photo,
      generateUserPhotoPathName(agent.id, photo),
    )
    await userServices.updateUserPhoto(agent.id, uploadedPhoto.path)
  }

  return agent
}
