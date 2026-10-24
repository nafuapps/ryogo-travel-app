import DriversScheduleChartComponent from "@/components/flows/drivers/home/driversScheduleChartComponent"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import DashboardHeader from "@/components/header/dashboardHeader"
import AllDriversHeaderTabs from "@/components/header/detailHeaderTabs/allDriversHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Drivers - ${pageTitle}`,
  description: pageDescription,
}

export default async function DriversSchedulePage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const driverSchedule14Days = await driverServices.findDriversScheduleNextDays(
    currentUser.agencyId,
    14,
  )
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers/schedule"} />
      <AllDriversHeaderTabs selectedTab={"Schedule"} />
      <PageWrapper id="DriversSchedulePage">
        <DriversScheduleChartComponent
          driverSchedule14Days={driverSchedule14Days}
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
          userId={currentUser.userId}
        />
        <StickyActionWrapper>
          <HelpIconButton
            href={"/dashboard/support/help-drivers"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}
