"use server"

import { writePermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { ModifyAgencyRequestType } from "@ryogo-travel-app/api/types/agency.types"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function modifyAgencyAction(data: ModifyAgencyRequestType) {
  const currentUser = await writePermissions.allowOwner(data.agencyId)
  if (!currentUser) {
    return
  }

  const modifiedAgency = await agencyServices.modifyAgency(data)
  if (!modifiedAgency) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: data.agencyId,
    isFeed: true,
    textKey: "ModifiedAgency",
    textObject: {
      userName: currentUser.name,
    },
    link: "/dashboard/account/subscription",
  })

  return modifiedAgency
}
