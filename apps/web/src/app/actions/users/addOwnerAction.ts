"use server"

import { AddOwnerEmailTemplate } from "@/components/email/addOwnerEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import { generateUserPhotoPathName } from "@/lib/utils"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { AddUserRequestType } from "@ryogo-travel-app/api/types/user.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"
import { headers } from "next/headers"

export async function addOwnerAction(
  data: AddUserRequestType,
  agencyName?: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    !currentUser.isAdmin ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const addedOwner = await userServices.addOwnerUser({
    data,
    currentUserId: currentUser.userId,
  })
  if (!addedOwner) return

  //Upload user photo if attached
  const [photoFile] = data.photos || []
  if (photoFile) {
    const uploadedPhoto = await uploadFile(
      photoFile,
      generateUserPhotoPathName(addedOwner.id, photoFile),
    )
    await userServices.updateUserPhoto({
      userId: addedOwner.id,
      photoUrl: uploadedPhoto.path,
    })
  }

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.USER,
    entityId: addedOwner.id,
    isFeed: true,
    textKey: "OwnerAdded",
    textObject: {
      addedOwnerName: addedOwner.name,
      userName: currentUser.name,
    },
  })

  const headerList = await headers()
  const host = headerList.get("host")
  const protocol = headerList.get("x-forwarded-proto") || "http"
  const absoluteUrl = `${protocol}://${host}/auth/login/password/${addedOwner.id}`

  //Send password in email to the agent
  await sendEmail({
    receipientEmail: [addedOwner.email],
    bcc: [SUPPORT_EMAIL],
    subject: "Welcome to RyoGo",
    element: AddOwnerEmailTemplate({
      name: addedOwner.name,
      password: addedOwner.password,
      link: absoluteUrl,
    }),
  })

  let whatsappInviteLink

  if (agencyName) {
    const t = await getTranslations("Dashboard.Whatsapp")
    const message = t("OwnerInvite", {
      ownerName: addedOwner.name,
      agencyName: agencyName,
      emailId: addedOwner.email,
      inviteLink: absoluteUrl,
    })
    whatsappInviteLink = getWhatsappMessageLink(data.phone, message)
  }

  return { ...addedOwner, whatsappInviteLink: whatsappInviteLink }
}
