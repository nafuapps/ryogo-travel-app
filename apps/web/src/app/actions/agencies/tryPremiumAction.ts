"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function tryPremiumAction(agencyId: string, userId: string) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== userId ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
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
