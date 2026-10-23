"use server"

import { writePermissions } from "@/lib/permissions"
import { generateAgencyLogoPathName } from "@/lib/utils"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { uploadFile } from "@ryogo-travel-app/db/storage"

export async function changeAgencyLogoAction({
  agencyId,
  logo,
}: {
  agencyId: string
  logo: File
}) {
  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser) {
    return
  }

  const uploadedFile = await uploadFile(
    logo,
    generateAgencyLogoPathName(agencyId),
  )
  const changedAgency = await agencyServices.updateAgencyLogo({
    agencyId,
    logoUrl: uploadedFile.path,
  })
  if (!changedAgency) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: agencyId,
    isFeed: true,
    textKey: "AgencyLogoChanged",
    textObject: {
      userName: currentUser.name,
    },
    link: "/dashboard/account/agency",
  })

  return changedAgency
}
