import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import DashboardHeader from "@/components/header/dashboardHeader"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { MissionIdRegex } from "@/lib/regex"
import ModifyReminderPageComponent from "@/components/missions/modifyReminder"

export const metadata: Metadata = {
  title: `Modify Reminder - ${pageTitle}`,
  description: pageDescription,
}

export default async function ModifyReminderPage({
  params,
}: {
  params: Promise<{ missionId: string }>
}) {
  const { missionId } = await params

  if (!MissionIdRegex.safeParse(missionId).success) {
    redirect("/dashboard/missions/reminders", RedirectType.replace)
  }

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
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
