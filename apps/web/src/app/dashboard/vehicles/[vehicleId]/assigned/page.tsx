import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import VehicleAssignedBookingsPageComponent from "./vehicleAssignedBookings"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Vehicle Assigned Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function VehicleAssignedBookingsPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>
}) {
  const { vehicleId } = await params

  const bookings =
    await vehicleServices.findVehicleAssignedBookingsById(vehicleId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/assigned"} />
      <VehicleAssignedBookingsPageComponent
        bookings={bookings}
        id={vehicleId}
      />
    </MainWrapper>
  )
}
