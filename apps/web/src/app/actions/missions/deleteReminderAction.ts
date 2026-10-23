"use server"

import { writePermissions } from "@/lib/permissions"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"

export async function deleteReminderAction({
  missionId,
  assignedUserId,
  agencyId,
}: {
  missionId: string
  assignedUserId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowAssignedUser({
    agencyId,
    assignedUserId,
  })
  if (!currentUser) return

  const removedMission = await missionServices.removeMissionById(missionId)

  return removedMission
}
