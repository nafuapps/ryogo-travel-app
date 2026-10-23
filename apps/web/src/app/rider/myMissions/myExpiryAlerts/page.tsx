import { HelpIconButton } from "@/components/flows/support/helpButtons"
import MyMissionDetailHeaderTabs from "@/components/header/detailHeaderTabs/myMissionDetailHeaderTabs"
import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import MyExpiryAlertsPageComponent from "./myExpiryAlerts"

export const metadata: Metadata = {
  title: `My Expiry Alerts - ${pageTitle}`,
  description: pageDescription,
}

export default async function ExpiryAlertsPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    notFound()
  }

  const assignedVehicle = await vehicleServices.findAssignedVehicleByDriverId(
    driver.id,
  )

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myMissions/myExpiryAlerts"} />
      <MyMissionDetailHeaderTabs selectedTab={"ExpiryAlerts"} />
      <PageWrapper id="MyExpiryAlertsPage">
        <MyExpiryAlertsPageComponent
          driver={driver}
          assignedVehicle={assignedVehicle}
        />
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
