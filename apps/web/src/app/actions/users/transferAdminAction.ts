"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { updateUserAdminInWebSession } from "@/lib/session"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function transferAdminAction(
  currentUserId: string,
  otherUserId: string,
  agencyId: string,
) {
  if (currentUserId === otherUserId) return

  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    !currentUser.isAdmin ||
    currentUser.userId !== currentUserId ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const updatedUser = await userServices.transferAdmin(
    currentUserId,
    otherUserId,
    agencyId,
  )
  if (!updatedUser) {
    return
  }

  await updateUserAdminInWebSession(false)

  await notificationServices.addNotification({
    agencyId: agencyId,
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
