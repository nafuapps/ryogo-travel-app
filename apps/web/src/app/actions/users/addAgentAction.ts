"use server"

import { AddAgentEmailTemplate } from "@/components/email/addAgentEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { getCurrentUser } from "@/lib/auth"
import { updateSessionUserStatus } from "@/lib/session"
import { generateUserPhotoPathName } from "@/lib/utils"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function addAgentAction(data: AddAgentRequestType) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }
  const agent = await userServices.addAgentUser(data)
  if (!agent) return

  if (agent.id && data.data.photos && data.data.photos[0]) {
    const photo = data.data.photos[0]
    const uploadedPhoto = await uploadFile(
      photo,
      generateUserPhotoPathName(agent.id, photo),
    )
    await userServices.updateUserPhoto(agent.id, uploadedPhoto.path)
  }

  if (data.ownerId) {
    //Activate owner account
    await userServices.activateUser(data.ownerId)
    //Activate agency
    await agencyServices.activateAgency(data.agencyId)
    //Update status in session cookie
    await updateSessionUserStatus(UserStatusEnum.ACTIVE)
  }

  //Send new password email to the agent
  sendEmail(
    [agent.email],
    "Welcome to RyoGo",
    AddAgentEmailTemplate({ name: agent.name, password: agent.password }),
  )

  return agent
}
