"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { refresh } from "next/cache"

export async function changeIsReadMissionAction({
  missionId,
  userId,
  agencyId,
  isRead,
}: {
  missionId: string
  userId: string
  agencyId: string
  isRead: boolean
}) {
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

  const mission = await missionServices.changeIsReadMission({
    missionId,
    isRead,
  })
  if (!mission) {
    return
  }
  refresh()
  return mission
}
