import { HelpIconButton } from "@/components/flows/support/helpButtons"
import DashboardHeader from "@/components/header/dashboardHeader"
import MissionDetailHeaderTabs from "@/components/header/detailHeaderTabs/missionDetailHeaderTabs"
import MissionsPageComponent from "@/components/missions/missions"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Missions - ${pageTitle}`,
  description: pageDescription,
}

export default async function MissionsPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

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
