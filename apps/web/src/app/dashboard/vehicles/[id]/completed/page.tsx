//Vehicles/id/completed bookings page

import { mainClassName } from "@/components/page/pageCommons"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import DashboardHeader from "../../../components/extra/dashboardHeader"
import VehicleCompletedBookingsPageComponent from "./vehicleCompletedBookings"

export default async function VehicleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const bookings = await vehicleServices.findVehicleCompletedBookingsById(id)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/completed"} />
      <VehicleCompletedBookingsPageComponent bookings={bookings} id={id} />
    </div>
  )
}
