"use server"

import { getCurrentUser } from "@/lib/auth"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { refresh } from "next/cache"
import { redirect, RedirectType } from "next/navigation"

export async function unreadMissionAction(missionId: string) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const mission = await missionServices.markUnReadMission(missionId)
  if (!mission) {
    return
  }
  refresh()
  return mission
}
