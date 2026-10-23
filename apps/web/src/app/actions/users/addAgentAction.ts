"use server"

import { AddAgentEmailTemplate } from "@/components/email/addAgentEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { writePermissions } from "@/lib/permissions"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import { generateUserPhotoPathName } from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { AddUserRequestType } from "@ryogo-travel-app/api/types/user.types"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"
import { headers } from "next/headers"

export async function addAgentAction({
  data,
  agencyName,
}: {
  data: AddUserRequestType
  agencyName?: string
}) {
  const currentUser = await writePermissions.allowOwner(data.agencyId)
  if (!currentUser) return

  const addedAgent = await userServices.addAgentUser(data)
  if (!addedAgent) return

  //Upload agent photo if attached
  const photoFile = data.photos
  if (photoFile) {
    const uploadedPhoto = await uploadFile(
      photoFile,
      generateUserPhotoPathName(addedAgent.id),
    )
    await userServices.updateUserPhoto({
      userId: addedAgent.id,
      photoUrl: uploadedPhoto.path,
    })
  }

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.USER,
    entityId: addedAgent.id,
    isFeed: true,
    textKey: "AgentAdded",
    textObject: {
      agentName: addedAgent.name,
      userName: currentUser.name,
    },
  })

  const headerList = await headers()
  const host = headerList.get("host")
  const protocol = headerList.get("x-forwarded-proto") || "http"
  const absoluteUrl = `${protocol}://${host}/auth/login/password/${addedAgent.id}`

  //Send password in email to the agent
  await sendEmail({
    receipientEmail: [addedAgent.email],
    bcc: [SUPPORT_EMAIL],
    subject: "Welcome to RyoGo",
    element: AddAgentEmailTemplate({
      name: addedAgent.name,
      password: addedAgent.password,
      link: absoluteUrl,
    }),
  })

  let whatsappInviteLink

  if (agencyName) {
    const t = await getTranslations("Dashboard.Whatsapp")
    const message = t("AgentInvite", {
      agentName: data.name,
      agencyName: agencyName,
      emailId: data.email,
      inviteLink: absoluteUrl,
    })
    whatsappInviteLink = getWhatsappMessageLink(data.phone, message)
  }

  return { ...addedAgent, whatsappInviteLink: whatsappInviteLink }
}
