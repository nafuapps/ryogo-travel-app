"use server"

import { writePermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function activateAgencyAction(agencyId: string) {
  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser) {
    return
  }

  const activatedAgency = await agencyServices.activateAgency(agencyId)
  if (!activatedAgency) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: activatedAgency.id,
    isFeed: true,
    textKey: "AgencyActivated",
    textObject: {
      userName: currentUser.name,
    },
    link: `/dashboard/account/agency`,
  })

  return activatedAgency
}
