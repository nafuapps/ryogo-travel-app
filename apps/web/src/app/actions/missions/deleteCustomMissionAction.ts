"use server"

import { getCurrentUser } from "@/lib/auth"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { redirect, RedirectType } from "next/navigation"

export async function deleteCustomMissionAction(
  missionId: string,
  userId: string,
  agencyId: string,
) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  if (currentUser.userId !== userId || currentUser.agencyId !== agencyId) {
    return
  }

  const mission = await missionServices.removeMission(missionId)

  return mission
}
