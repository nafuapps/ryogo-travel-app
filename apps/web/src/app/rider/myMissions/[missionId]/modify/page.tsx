import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import DashboardHeader from "@/components/header/dashboardHeader"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import ModifyCustomMissionPageComponent from "./modifyCustomMission"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"

export const metadata: Metadata = {
  title: `Modify Custom Mission - ${pageTitle}`,
  description: pageDescription,
}

export default async function ModifyCustomMissionPage({
  params,
}: {
  params: Promise<{ missionId: string }>
}) {
  const { missionId } = await params
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const mission = await missionServices.findMissionById(missionId)

  if (!mission || currentUser.userId !== mission.userId) {
    redirect("/dashboard/mission-control", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/mission-control/modify"} />
      <ModifyCustomMissionPageComponent mission={mission} />
    </MainWrapper>
  )
}
