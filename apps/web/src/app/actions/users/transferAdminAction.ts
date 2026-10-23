"use server"

import { writePermissions } from "@/lib/permissions"
import { updateUserAdminInWebSession } from "@/lib/session"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function transferAdminAction({
  currentUserId,
  otherUserId,
  agencyId,
}: {
  currentUserId: string
  otherUserId: string
  agencyId: string
}) {
  if (currentUserId === otherUserId) return

  const currentUser = await writePermissions.allowOwner(agencyId)
  if (!currentUser || !currentUser.isAdmin) {
    return
  }

  const updatedUser = await userServices.transferAdmin({
    currentUserId,
    otherUserId,
    agencyId,
  })
  if (!updatedUser) {
    return
  }

  await updateUserAdminInWebSession(false)

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.AGENCY,
    entityId: agencyId,
    isFeed: true,
    textKey: "AdminTransferred",
    textObject: {
      newAdminName: updatedUser.name,
      userName: currentUser.name,
    },
  })

  await missionServices.addMission({
    agencyId: agencyId,
    userId: updatedUser.id,
    entityType: EntityTypeEnum.AGENCY,
    entityId: agencyId,
    titleKey: "AdminTransferred.Title",
    messageKey: "AdminTransferred.Message",
    isCritical: true,
    link: `/dashboard/users/${updatedUser.id}`,
  })

  return updatedUser
}
