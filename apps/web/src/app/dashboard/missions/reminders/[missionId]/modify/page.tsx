import DashboardHeader from "@/components/header/dashboardHeader"
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

export default async function ModifyReminderPage({
  params,
}: {
  params: Promise<{ missionId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { missionId } = await params

  if (!MissionIdRegex.safeParse(missionId).success) {
    redirect("/dashboard/missions/reminders", RedirectType.replace)
  }

  const mission = await missionServices.findMissionById(missionId)

  //If no mission found, not a custom mission or user/agency mismatch
  if (
    !mission ||
    !mission.isCustom ||
    currentUser.userId !== mission.userId ||
    mission.agencyId !== currentUser.agencyId
  ) {
    redirect("/dashboard/missions/reminders", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/missions/reminders/modify"} />
      <ModifyReminderPageComponent mission={mission} />
    </MainWrapper>
  )
}
