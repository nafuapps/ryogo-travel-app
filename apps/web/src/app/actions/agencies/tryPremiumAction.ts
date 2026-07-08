"use server"

import { getCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function tryPremiumAction(agencyId: string) {
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.agencyId !== agencyId) {
    return
  }

  const agency = await agencyServices.tryPremium(agencyId)
  if (!agency) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: agencyId,
    isFeed: true,
    textKey: "TryPremium",
    textObject: {
      userName: currentUser.name,
    },
    link: "/dashboard/account/subscription",
  })

  return agency
}
