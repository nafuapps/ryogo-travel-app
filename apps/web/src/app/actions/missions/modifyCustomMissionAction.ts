"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { ModifyMissionRequestType } from "@ryogo-travel-app/api/types/mission.types"

export async function modifyCustomMissionAction(
  data: ModifyMissionRequestType,
) {
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

  const newMission = await missionServices.modifyMission(data)

  return newMission
}
