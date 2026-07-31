"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { ModifyAgencyRequestType } from "@ryogo-travel-app/api/types/agency.types"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function modifyAgencyAction(
  userId: string,
  data: ModifyAgencyRequestType,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== userId ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== data.agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const agency = await agencyServices.modifyAgency(data)
  if (!agency) return

  await notificationServices.addNotification({
    agencyId: data.agencyId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: data.agencyId,
    isFeed: true,
    textKey: "ModifiedAgency",
    textObject: {
      userName: currentUser.name,
    },
    link: "/dashboard/account/subscription",
  })

  return agency
}
