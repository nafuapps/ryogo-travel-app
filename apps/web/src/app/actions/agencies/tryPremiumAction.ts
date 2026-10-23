"use server"

import { writePermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function tryPremiumAction({
  agencyId,
  days,
}: {
  agencyId: string
  days: number
}) {
  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser) {
    return
  }

  const agency = await agencyServices.tryPremium(agencyId)
  if (!agency) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: agencyId,
    isFeed: true,
    textKey: "TryPremium",
    textObject: {
      userName: currentUser.name,
      days: days,
    },
    link: "/dashboard/account/subscription",
  })

  return agency
}
