"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { AddMissionRequestType } from "@ryogo-travel-app/api/types/mission.types"

export async function addReminderAction({
  data,
}: {
  data: AddMissionRequestType
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
      entityId: data.entityId ?? currentUser.userId,
      entityType: data.entityType,
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
