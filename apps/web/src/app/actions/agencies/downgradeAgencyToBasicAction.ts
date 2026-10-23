"use server"

import { writePermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function downgradeAgencyToBasicAction(agencyId: string) {
  const currentUser = await writePermissions.allowDashboardUser(agencyId)
  if (!currentUser) {
    return
  }

  const downgradedAgency = await agencyServices.downgradeAgencyToBasic(agencyId)
  if (!downgradedAgency) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: agencyId,
    isFeed: true,
    textKey: "DowngradedAgencyToBasic",
    link: "/dashboard/account/agency",
  })

  return downgradedAgency
}
