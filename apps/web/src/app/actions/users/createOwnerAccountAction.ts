"use server"

import { OnboardOwnerEmailTemplate } from "@/components/email/onboardOwnerEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import { getCurrentUser } from "@/lib/auth"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import {
  generateAgencyLogoPathName,
  generateAgencyQRCodePathName,
  generateUserPhotoPathName,
} from "@/lib/utils"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"
import { headers } from "next/headers"
import { redirect, RedirectType } from "next/navigation"

export async function createOwnerAccountAction(
  data: CreateOwnerAccountRequestType,
) {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    if (currentUser.userRole === UserRolesEnum.DRIVER) {
      redirect("/rider", RedirectType.replace)
    }
    redirect("/dashboard", RedirectType.replace)
  }

  //Try to create a new user and agency account
  const user = await userServices.addAgencyAndOwnerAccount(data)
  if (!user) return

  // Upload agency logo to storage
  if (data.agency.logo && data.agency.logo[0]) {
    const logo = data.agency.logo[0]
    const uploadLogoData = await uploadFile(
      logo,
      generateAgencyLogoPathName(user.agencyId, logo),
    )
    await agencyServices.updateAgencyLogo(user.agencyId, uploadLogoData.path)
  }

  // Upload agency qrCode to storage
  if (data.agency.qrCode && data.agency.qrCode[0]) {
    const qrCode = data.agency.qrCode[0]
    const uploadQRCodeData = await uploadFile(
      qrCode,
      generateAgencyQRCodePathName(user.agencyId, qrCode),
    )
    await agencyServices.updateAgencyQRCode(
      user.agencyId,
      uploadQRCodeData.path,
    )
  }

  // Upload owner photo to storage
  if (data.owner.photos && data.owner.photos[0]) {
    const photo = data.owner.photos[0]
    const uploadedPhoto = await uploadFile(
      photo,
      generateUserPhotoPathName(user.userId, photo),
    )
    await userServices.updateUserPhoto(user.userId, uploadedPhoto.path)
  }

  await notificationServices.addNotification({
    agencyId: user.agencyId,
    entityType: EntityTypeEnum.USER,
    entityId: user.userId,
    isFeed: true,
    textKey: "OwnerCreated",
    textObject: {
      userName: user.name,
    },
  })

  await notificationServices.addNotification({
    agencyId: user.agencyId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: user.agencyId,
    isFeed: true,
    textKey: "AgencyCreated",
    textObject: {
      userName: user.name,
    },
    link: `/dashboard/account/agency`,
  })

  const headerList = await headers()
  const host = headerList.get("host")
  const protocol = headerList.get("x-forwarded-proto") || "http"
  const absoluteUrl = `${protocol}://${host}/onboarding/verify-account`

  //Send welcome email with verification code to the owner
  sendEmail({
    receipientEmail: [user.email],
    bcc: [SUPPORT_EMAIL],
    subject: "Welcome to RyoGo",
    element: OnboardOwnerEmailTemplate({
      name: user.name,
      code: user.code,
      link: absoluteUrl,
    }),
  })

  return user
}
