import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import RiderHeader from "@/components/header/riderHeader"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { differenceInDays } from "date-fns"
import { EXPIRATION_ALERT_WINDOW_DAYS } from "@ryogo-travel-app/api/apiConfig"
import MyMissionControlPageComponent from "./myMissionControl"

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

  const missions = await missionServices.findMissionsByUserId(
    currentUser.userId,
  )

  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    redirect("/auth/login", RedirectType.replace)
  }

  //TODO: Show assigned vehicle alert as well
  const showDriverAlert =
    driver.licenseExpiresOn &&
    differenceInDays(driver.licenseExpiresOn, new Date()) <
      EXPIRATION_ALERT_WINDOW_DAYS

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myMissions"} />
      <MyMissionControlPageComponent
        missions={missions}
        isPremium={agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC}
        driverAlert={showDriverAlert ? driver : undefined}
      />
    </MainWrapper>
  )
}
