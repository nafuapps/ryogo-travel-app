"use server"

import { getCurrentUser } from "@/lib/auth"
import { generateAgencyQRCodePathName } from "@/lib/utils"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeAgencyQRCodeAction(
  agencyId: string,
  qrCode: FileList,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!qrCode[0]) {
    return
  }
  const uploadedFile = await uploadFile(
    qrCode[0],
    generateAgencyQRCodePathName(agencyId, qrCode[0]),
  )
  const updatedAgency = await agencyServices.updateAgencyQRCode(
    agencyId,
    uploadedFile.path,
  )
  if (!updatedAgency) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: agencyId,
    isFeed: true,
    textKey: "AgencyQRCodeChanged",
    textObject: {
      userName: currentUser.name,
    },
    link: "/dashboard/account/agency",
  })

  return updatedAgency
}
