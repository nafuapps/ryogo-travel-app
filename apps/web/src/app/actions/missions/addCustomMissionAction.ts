"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function addCustomMissionAction(
  userId: string,
  agencyId: string,
  data: {
    entityType: EntityTypeEnum
    entityId?: string
    title: string
    message?: string
    dueDate: Date
    isCritical: boolean
  },
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

  const newMission = await missionServices.addMission(
    {
      agencyId: currentUser.agencyId,
      userId: currentUser.userId,
      entityType: data.entityId ? data.entityType : EntityTypeEnum.USER, //If no entity id, default to type User with userId
      entityId: data.entityId ?? currentUser.userId,
      titleKey: data.title,
      messageKey: data.message,
      dueDate: data.dueDate,
      isCritical: data.isCritical,
      isCustom: true,
    },
    false,
  )

  return newMission
}
