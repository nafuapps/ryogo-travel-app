"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"

export async function deleteMissionAction(
  missionId: string,
  userId: string,
  agencyId: string,
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

  const mission = await missionServices.removeMission(missionId)

  return mission
}
