import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import DashboardHeader from "@/components/header/dashboardHeader"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import MissionsPageComponent from "@/components/missions/missions"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import MissionDetailHeaderTabs from "@/components/header/detailHeaderTabs/missionDetailHeaderTabs"
import { HelpIconButton } from "@/components/flows/support/helpButtons"

export const metadata: Metadata = {
  title: `Missions - ${pageTitle}`,
  description: pageDescription,
}

export default async function MissionsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const missions = await missionServices.findMissionsByUserId(
    currentUser.userId,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/missions"} />
      <MissionDetailHeaderTabs selectedTab={"Missions"} />
      <PageWrapper id="MissionsPage">
        <MissionsPageComponent missions={missions} />
        <StickyActionWrapper>
          <HelpIconButton
            href={"/dashboard/support/help-missions"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}
