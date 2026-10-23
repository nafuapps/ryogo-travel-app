"use server"

import { writePermissions } from "@/lib/permissions"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { refresh } from "next/cache"

export async function changeIsReadMissionAction({
  missionId,
  assignedUserId,
  agencyId,
  isRead,
}: {
  missionId: string
  assignedUserId: string
  agencyId: string
  isRead: boolean
}) {
  const currentUser = await writePermissions.allowAssignedUser({
    agencyId,
    assignedUserId,
  })
  if (!currentUser) return

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
