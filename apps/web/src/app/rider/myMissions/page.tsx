import { HelpIconButton } from "@/components/flows/support/helpButtons"
import MyMissionDetailHeaderTabs from "@/components/header/detailHeaderTabs/myMissionDetailHeaderTabs"
import RiderHeader from "@/components/header/riderHeader"
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
  title: `My Missions - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyMissionsPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const missions = await missionServices.findMissionsByUserId(
    currentUser.userId,
  )

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myMissions"} />
      <MyMissionDetailHeaderTabs selectedTab={"Missions"} />
      <PageWrapper id="MyMissionsPage">
        <MissionsPageComponent missions={missions} />
        <StickyActionWrapper>
          <HelpIconButton
            href={"/rider/mySupport/help-missions"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}
