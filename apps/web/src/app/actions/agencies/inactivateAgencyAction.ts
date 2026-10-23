"use server"

import { writePermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function inactivateAgencyAction(agencyId: string) {
  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser) {
    return
  }

  const inactivatedAgency = await agencyServices.inactivateAgency(agencyId)
  if (!inactivatedAgency) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: inactivatedAgency.id,
    isFeed: true,
    textKey: "AgencyInactivated",
    textObject: {
      userName: currentUser.name,
    },
    link: `/dashboard/account/agency`,
  })

  return inactivatedAgency
}
