import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import DashboardHeader from "../../../components/dashboardHeader"
import VehicleAssignedBookingsPageComponent from "./vehicleAssignedBookings"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Vehicle Assigned Bookings - ${pageTitle}`,
  description: pageDescription,
}

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
