"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { AddCustomMissionRequestType } from "@ryogo-travel-app/api/types/mission.types"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export async function addCustomMissionAction({
  data,
}: {
  data: AddCustomMissionRequestType
}) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== data.userId ||
    currentUser.agencyId !== data.agencyId
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
