import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import RiderHeader from "@/components/header/riderHeader"
import MissionControlPageComponent from "@/app/dashboard/mission-control/missionControl"

export const metadata: Metadata = {
  title: `My Missions - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyMissionsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const missions = await missionServices.findMissionsByUserId(
    currentUser.userId,
  )

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myMissions"} />
      <MissionControlPageComponent missions={missions} />
    </MainWrapper>
  )
}
