import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import RiderHeader from "@/components/header/riderHeader"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import MyMissionsPageComponent from "./myMissions"
import MyMissionDetailHeaderTabs from "@/components/header/detailHeaderTabs/myMissionDetailHeaderTabs"

export const metadata: Metadata = {
  title: `My Missions - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyMissionsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isPremium = agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC

  let missions = await missionServices.findMissionsByUserId(currentUser.userId)

  //SUBSCRIPTION BLOCKER: Hide custom missions if not subscribed
  if (!isPremium) {
    missions = missions.filter((m) => !m.isCustom)
  }

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myMissions"} />
      <MyMissionDetailHeaderTabs selectedTab={"Missions"} />
      <MyMissionsPageComponent missions={missions} isPremium={isPremium} />
    </MainWrapper>
  )
}
