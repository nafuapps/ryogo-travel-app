"use server"

import { updateSessionUserStatus } from "@/lib/session"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function addAgentAction(data: AddAgentRequestType) {
  const agent = await userServices.addAgentUser(data)
  if (agent.id && data.data.photos && data.data.photos[0]) {
    const photo = data.data.photos[0]
    const fileName = `${Date.now()}-${photo.name}`
    const uploadedPhoto = await uploadFile(
      photo,
      `${agent.id}/photo/${fileName}`,
    )
    await userServices.updateUserPhoto(agent.id, uploadedPhoto.path)
  }

  if (data.ownerId) {
    //Activate owner account
    await userServices.activateUser(data.ownerId)
    //Activate agency
    const agency = await agencyServices.activateAgency(data.agencyId)
    //Update status in session cookie
    await updateSessionUserStatus(UserStatusEnum.ACTIVE)
  }

  return agent
}
