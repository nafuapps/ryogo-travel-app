import { HelpIconButton } from "@/components/flows/support/helpButtons"
import VehiclesScheduleChartComponent from "@/components/flows/vehicles/home/vehiclesScheduleChartComponent"
import DashboardHeader from "@/components/header/dashboardHeader"
import AllVehiclesHeaderTabs from "@/components/header/detailHeaderTabs/allVehiclesHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Vehicles - ${pageTitle}`,
  description: pageDescription,
}

export default async function VehiclesSchedulePage() {
  const currentUser = await readPermissions.getAuthenticatedUser()
  const agencyId = currentUser.agencyId

  const vehicleSchedule14Days =
    await vehicleServices.findVehiclesScheduleNextDays(agencyId, 14)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/schedule"} />
      <AllVehiclesHeaderTabs selectedTab={"Schedule"} />

      <PageWrapper id="VehiclesSchedulePage">
        <VehiclesScheduleChartComponent
          vehicleSchedule14Days={vehicleSchedule14Days}
          userId={currentUser.userId}
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        />
        <StickyActionWrapper>
          <HelpIconButton
            href={"/dashboard/support/help-vehicles"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}
