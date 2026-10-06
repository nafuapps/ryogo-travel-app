"use server"

import { AddDriverEmailTemplate } from "@/components/email/addDriverEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import {
  generateLicensePhotoPathName,
  generateUserPhotoPathName,
} from "@/lib/utils"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"
import { headers } from "next/headers"

export async function addDriverAction(
  data: AddDriverRequestType,
  agencyName?: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const driver = await userServices.addDriverUser(data)
  if (!driver) return

  if (driver.id) {
    // Upload files to Supabase Storage
    const [licenseFile] = data.licensePhotos || []
    if (licenseFile) {
      const uploadedLicense = await uploadFile(
        licenseFile,
        generateLicensePhotoPathName(driver.id, licenseFile),
      )
      await driverServices.updateDriverLicensePhoto({
        driverId: driver.id,
        licensePhotoUrl: uploadedLicense.path,
      })
    }

    const [userPhotoFile] = data.userPhotos || []
    if (userPhotoFile) {
      const uploadedPhoto = await uploadFile(
        userPhotoFile,
        generateUserPhotoPathName(driver.userId, userPhotoFile),
      )
      await userServices.updateUserPhoto({
        userId: driver.userId,
        photoUrl: uploadedPhoto.path,
      })
    }
  }

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: driver.id,
    isFeed: true,
    textKey: "DriverAdded",
    textObject: {
      driverName: driver.name,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${driver.id}`,
  })

  const headerList = await headers()
  const host = headerList.get("host")
  const protocol = headerList.get("x-forwarded-proto") || "http"
  const absoluteUrl = `${protocol}://${host}/auth/login/password/${driver.userId}`

  //Send password in email to the driver
  await sendEmail({
    receipientEmail: [driver.email],
    bcc: [SUPPORT_EMAIL],
    subject: "Welcome to RyoGo",
    element: AddDriverEmailTemplate({
      name: driver.name,
      password: driver.password,
      link: absoluteUrl,
    }),
  })

  let whatsappInviteLink

  if (agencyName) {
    const t = await getTranslations("Dashboard.Whatsapp")
    const message = t("DriverInvite", {
      driverName: driver.name,
      agencyName: agencyName,
      emailId: driver.email,
      inviteLink: absoluteUrl,
    })
    whatsappInviteLink = getWhatsappMessageLink(data.phone, message)
  }

  return { ...driver, whatsappInviteLink: whatsappInviteLink }
}
