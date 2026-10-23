import RiderHeader from "@/components/header/riderHeader"
import ModifyReminderPageComponent from "@/components/missions/modifyReminder"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { MissionIdRegex } from "@/lib/regex"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"

export const metadata: Metadata = {
  title: `Modify Reminder - ${pageTitle}`,
  description: pageDescription,
}

export default async function ModifyMyReminderPage({
  params,
}: {
  params: Promise<{ missionId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { missionId } = await params

  if (!MissionIdRegex.safeParse(missionId).success) {
    redirect("/rider/myMissions/myReminders", RedirectType.replace)
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
