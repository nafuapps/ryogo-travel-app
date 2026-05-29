"use server"

import { getCurrentUser } from "@/lib/auth"
import { generateAgencyLogoPathName } from "@/lib/utils"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeAgencyLogoAction(agencyId: string, logo: FileList) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!logo[0]) {
    return
  }
  const uploadedFile = await uploadFile(
    logo[0],
    generateAgencyLogoPathName(agencyId, logo[0]),
  )
  const updatedAgency = await agencyServices.updateAgencyLogo(
    agencyId,
    uploadedFile.path,
  )
  if (!updatedAgency) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: agencyId,
    isFeed: true,
    textKey: "AgencyLogoChanged",
    textObject: {
      userName: currentUser.name,
    },
    link: "/dashboard/account/agency",
  })

  return updatedAgency
}
