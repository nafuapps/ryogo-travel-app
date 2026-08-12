import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import VehicleCompletedBookingsPageComponent from "./vehicleCompletedBookings"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

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
      <VehicleCompletedBookingsPageComponent
        bookings={bookings}
        id={vehicleId}
      />
    </MainWrapper>
  )
}
