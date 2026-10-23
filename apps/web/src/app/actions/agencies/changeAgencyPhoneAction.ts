"use server"

import { writePermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function changeAgencyPhoneAction({
  agencyId,
  businessPhone,
}: {
  agencyId: string
  businessPhone: string
}) {
  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser) {
    return
  }

  const changedAgency = await agencyServices.changeAgencyPhone({
    agencyId,
    businessPhone,
  })
  if (!changedAgency) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: agencyId,
    isFeed: true,
    textKey: "ChangedAgencyPhone",
    textObject: {
      userName: currentUser.name,
    },
    link: "/dashboard/account/agency",
  })

  return changedAgency
}
