"use server"

import { writePermissions } from "@/lib/permissions"
import { generateAgencyQRCodePathName } from "@/lib/utils"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeAgencyQRCodeAction({
  agencyId,
  qrCode,
}: {
  agencyId: string
  qrCode: File
}) {
  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser) {
    return
  }

  const uploadedFile = await uploadFile(
    qrCode,
    generateAgencyQRCodePathName(agencyId),
  )

  const changedAgency = await agencyServices.updateAgencyQRCode({
    agencyId,
    qrCodeUrl: uploadedFile.path,
  })
  if (!changedAgency) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: agencyId,
    isFeed: true,
    textKey: "AgencyQRCodeChanged",
    textObject: {
      userName: currentUser.name,
    },
    link: "/dashboard/account/agency",
  })

  return changedAgency
}
