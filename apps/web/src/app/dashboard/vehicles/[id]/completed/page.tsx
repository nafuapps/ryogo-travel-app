import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import DashboardHeader from "../../../components/dashboardHeader"
import VehicleCompletedBookingsPageComponent from "./vehicleCompletedBookings"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Vehicle Completed Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function VehicleCompletedBookingsPage({
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
