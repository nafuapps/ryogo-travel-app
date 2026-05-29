"use server"

import { getCurrentUser } from "@/lib/auth"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { refresh } from "next/cache"

export async function markReadMissionAction(missionId: string) {
  const currentUser = await getCurrentUser()

  if (
    !currentUser ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(currentUser.userRole)
  ) {
    return
  }

  const mission = await missionServices.markReadMission(missionId)
  if (!mission) {
    return
  }
  refresh()
  return mission
}
