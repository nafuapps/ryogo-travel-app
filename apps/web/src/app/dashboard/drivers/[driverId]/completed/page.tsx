import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import DriverCompletedBookingsPageComponent from "./driverCompletedBookings"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"

export const metadata: Metadata = {
  title: `Driver Completed Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function DriverCompletedBookingsPage({
  params,
}: {
  params: Promise<{ driverId: string }>
}) {
  const { driverId } = await params

  const bookings =
    await driverServices.findDriverCompletedBookingsById(driverId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/completed"} />
      <DriverDetailHeaderTabs selectedTab={"Completed"} id={driverId} />
      <DriverCompletedBookingsPageComponent bookings={bookings} />
    </MainWrapper>
  )
}
