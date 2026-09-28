import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import VehicleCompletedBookingsPageComponent from "./vehicleCompletedBookings"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import VehicleDetailHeaderTabs from "@/components/header/detailHeaderTabs/vehicleDetailHeaderTabs"

export const metadata: Metadata = {
  title: `Vehicle Completed Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function VehicleCompletedBookingsPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>
}) {
  const { vehicleId } = await params

  const bookings =
    await vehicleServices.findVehicleCompletedBookingsById(vehicleId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/completed"} />
      <VehicleDetailHeaderTabs selectedTab={"Completed"} id={vehicleId} />
      <VehicleCompletedBookingsPageComponent bookings={bookings} />
    </MainWrapper>
  )
}
