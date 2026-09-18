import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import OnTripDriversComponent from "@/components/flows/drivers/home/onTripDriversComponent"
import AllDriversListComponent from "@/components/flows/drivers/home/allDriversListComponent"
import DriversScheduleChartComponent from "@/components/flows/drivers/home/driversScheduleChartComponent"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"

export const metadata: Metadata = {
  title: `Drivers - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllDriversPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agencyId = currentUser.agencyId

  const ongoingTrips = await bookingServices.findOngoingTrips(agencyId)
  const allDrivers = await driverServices.findDriversByAgency(agencyId)

  const driverSchedule14Days = await driverServices.findDriversScheduleNextDays(
    agencyId,
    14,
  )
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers"} />
      <PageWrapper id="AllDriversPage">
        {ongoingTrips.length > 0 && (
          <OnTripDriversComponent ongoingTrips={ongoingTrips} />
        )}
        <AllDriversListComponent allDrivers={allDrivers} />
        <DriversScheduleChartComponent
          driverSchedule14Days={driverSchedule14Days}
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
          userId={currentUser.userId}
        />
      </PageWrapper>
    </MainWrapper>
  )
}
