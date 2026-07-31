"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { refresh } from "next/cache"

export async function downgradeAgencyToBasicAction(
  userId: string,
  agencyId: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== userId ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const agency = await agencyServices.downgradeAgencyToBasic(agencyId)
  if (!agency) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: agencyId,
    isFeed: true,
    textKey: "DowngradedAgencyToBasic",
    link: "/dashboard/account/agency",
  })

  refresh() //Refresh the page to update the subscription details in the UI

  return agency
}
