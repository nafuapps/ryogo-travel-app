import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import ModifyCustomMissionPageComponent from "./modifyCustomMission"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { MissionIdRegex } from "@/lib/regex"
import RiderHeader from "@/components/header/riderHeader"

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

  if (!MissionIdRegex.safeParse(missionId).success) {
    redirect("/rider/myMissions", RedirectType.replace)
  }

  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const mission = await missionServices.findMissionById(missionId)

  if (!mission || currentUser.userId !== mission.userId) {
    redirect("/rider/myMissions", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myMissions/modify"} />
      <ModifyCustomMissionPageComponent mission={mission} />
    </MainWrapper>
  )
}
