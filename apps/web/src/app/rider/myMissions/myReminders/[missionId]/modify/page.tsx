import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { MissionIdRegex } from "@/lib/regex"
import RiderHeader from "@/components/header/riderHeader"
import ModifyReminderPageComponent from "@/components/missions/modifyReminder"

export const metadata: Metadata = {
  title: `Modify Reminder - ${pageTitle}`,
  description: pageDescription,
}

export default async function ModifyMyReminderPage({
  params,
}: {
  params: Promise<{ missionId: string }>
}) {
  const { missionId } = await params

  if (!MissionIdRegex.safeParse(missionId).success) {
    redirect("/rider/myMissions/myReminders", RedirectType.replace)
  }

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const mission = await missionServices.findMissionById(missionId)

  //If no mission found, not a custom mission or user/agency mismatch, redirect
  if (
    !mission ||
    !mission.isCustom ||
    currentUser.userId !== mission.userId ||
    currentUser.agencyId !== mission.agencyId
  ) {
    redirect("/rider/myMissions/myReminders", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myMissions/myReminders/modify"} />
      <ModifyReminderPageComponent mission={mission} isRider />
    </MainWrapper>
  )
}
