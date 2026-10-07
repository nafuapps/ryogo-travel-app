import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import MyExpiryAlertsPageComponent from "./myExpiryAlerts"
import MyMissionDetailHeaderTabs from "@/components/header/detailHeaderTabs/myMissionDetailHeaderTabs"
import RiderHeader from "@/components/header/riderHeader"

export const metadata: Metadata = {
  title: `My Expiry Alerts - ${pageTitle}`,
  description: pageDescription,
}

export default async function ExpiryAlertsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    redirect("/auth/login", RedirectType.replace)
  }

  const assignedVehicle = await vehicleServices.findAssignedVehicleByDriverId(
    driver.id,
  )

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myMissions/myExpiryAlerts"} />
      <MyMissionDetailHeaderTabs selectedTab={"ExpiryAlerts"} />
      <MyExpiryAlertsPageComponent
        driver={driver}
        assignedVehicle={assignedVehicle}
      />
    </MainWrapper>
  )
}
