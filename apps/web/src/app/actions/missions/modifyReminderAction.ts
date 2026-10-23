"use server"

import { writePermissions } from "@/lib/permissions"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { ModifyMissionRequestType } from "@ryogo-travel-app/api/types/mission.types"

export async function modifyReminderAction(data: ModifyMissionRequestType) {
  const currentUser = await writePermissions.allowAssignedUser({
    agencyId: data.agencyId,
    assignedUserId: data.userId,
  })
  if (!currentUser) return

  const newMission = await missionServices.modifyMission(data)

  return newMission
}
