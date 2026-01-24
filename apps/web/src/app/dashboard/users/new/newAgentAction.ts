"use server"

import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { NewAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function newAgentAction(
  agencyId: string,
  data: NewAgentRequestType,
) {
  const agent = await userServices.addNewAgent(agencyId, {
    email: data.email,
    name: data.name,
    phone: data.phone,
  })
  console.log({ agent })
  if (agent.id && data.photos && data.photos[0]) {
    const photo = data.photos[0]
    const fileName = `${Date.now()}-${photo.name}`
    const uploadedPhoto = await uploadFile(
      photo,
      `${agent.id}/photo/${fileName}`,
    )
    await userServices.updateUserPhoto(agent.id, uploadedPhoto.path)
  }

  return agent
}
