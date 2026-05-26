import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import DashboardHeader from "@/components/header/dashboardHeader"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import MissionControlPageComponent from "./missionControl"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"

export const metadata: Metadata = {
  title: `Mission Control - ${pageTitle}`,
  description: pageDescription,
}

export default async function MissionControlPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const missions = await missionServices.findMissionsByUserId(
    currentUser.userId,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/mission-control"} />
      <MissionControlPageComponent missions={missions} />
    </MainWrapper>
  )
}
