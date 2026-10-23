"use server"

import { AddDriverEmailTemplate } from "@/components/email/addDriverEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { writePermissions } from "@/lib/permissions"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import {
  generateLicensePhotoPathName,
  generateUserPhotoPathName,
} from "@/lib/utils"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"
import { headers } from "next/headers"

export async function addDriverAction({
  data,
  agencyName,
}: {
  data: AddDriverRequestType
  agencyName?: string
}) {
  const currentUser = await writePermissions.allowDashboardUser(data.agencyId)
  if (!currentUser) return

  const addedDriver = await userServices.addDriverUser(data)
  if (!addedDriver) return

  if (addedDriver.id) {
    // Upload files to Supabase Storage
    const licenseFile = data.licensePhotos
    if (licenseFile) {
      const uploadedLicense = await uploadFile(
        licenseFile,
        generateLicensePhotoPathName(addedDriver.id),
      )
      await driverServices.updateDriverLicensePhoto({
        driverId: addedDriver.id,
        licensePhotoUrl: uploadedLicense.path,
      })
    }

    const userPhotoFile = data.userPhotos
    if (userPhotoFile) {
      const uploadedPhoto = await uploadFile(
        userPhotoFile,
        generateUserPhotoPathName(addedDriver.userId),
      )
      await userServices.updateUserPhoto({
        userId: addedDriver.userId,
        photoUrl: uploadedPhoto.path,
      })
    }
  }

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER,
    entityId: addedDriver.id,
    isFeed: true,
    textKey: "DriverAdded",
    textObject: {
      driverName: addedDriver.name,
      userName: currentUser.name,
    },
    link: `/dashboard/drivers/${addedDriver.id}`,
  })

  const headerList = await headers()
  const host = headerList.get("host")
  const protocol = headerList.get("x-forwarded-proto") || "http"
  const absoluteUrl = `${protocol}://${host}/auth/login/password/${addedDriver.userId}`

  //Send password in email to the driver
  await sendEmail({
    receipientEmail: [addedDriver.email],
    bcc: [SUPPORT_EMAIL],
    subject: "Welcome to RyoGo",
    element: AddDriverEmailTemplate({
      name: addedDriver.name,
      password: addedDriver.password,
      link: absoluteUrl,
    }),
  })

  let whatsappInviteLink

  if (agencyName) {
    const t = await getTranslations("Dashboard.Whatsapp")
    const message = t("DriverInvite", {
      driverName: addedDriver.name,
      agencyName: agencyName,
      emailId: addedDriver.email,
      inviteLink: absoluteUrl,
    })
    whatsappInviteLink = getWhatsappMessageLink(data.phone, message)
  }

  return { ...addedDriver, whatsappInviteLink: whatsappInviteLink }
}
