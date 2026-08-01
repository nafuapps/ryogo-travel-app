"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function modifyCustomMissionAction(
  missionId: string,
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

  const newMission = await missionServices.modifyMission(
    missionId,
    data.entityId ? data.entityType : EntityTypeEnum.USER, //If no entity id, default to type User with userId
    data.entityId ?? currentUser.userId,
    data.title,
    data.dueDate,
    data.isCritical,
    data.message,
  )

  return newMission
}
