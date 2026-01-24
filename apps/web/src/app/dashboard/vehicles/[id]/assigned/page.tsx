//Vehicles/id/assigned bookings page

import { mainClassName } from "@/components/page/pageCommons"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import DashboardHeader from "../../../components/extra/dashboardHeader"
import VehicleAssignedBookingsPageComponent from "./vehicleAssignedBookings"

export default async function VehicleAssignedBookingsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const bookings = await vehicleServices.findVehicleAssignedBookingsById(id)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/assigned"} />
      <VehicleAssignedBookingsPageComponent bookings={bookings} id={id} />
    </div>
  )
}
