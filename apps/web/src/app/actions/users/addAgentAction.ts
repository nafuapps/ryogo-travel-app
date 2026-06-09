"use server"

import { AddAgentEmailTemplate } from "@/components/email/addAgentEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { getCurrentUser } from "@/lib/auth"
import { generateUserPhotoPathName } from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"
import { headers } from "next/headers"

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

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.USER,
    entityId: agent.id,
    isFeed: true,
    textKey: "AgentAdded",
    textObject: {
      agentName: agent.name,
      userName: currentUser.name,
    },
  })

  const headerList = await headers()
  const host = headerList.get("host")
  const protocol = headerList.get("x-forwarded-proto") || "http"
  const absoluteUrl = `${protocol}://${host}/auth/login/password/${agent.id}`

  //Send password in email to the agent
  sendEmail(
    [agent.email],
    "Welcome to RyoGo",
    AddAgentEmailTemplate({
      name: agent.name,
      password: agent.password,
      link: absoluteUrl,
    }),
  )

  return agent
}
