//Drivers/id/assigned bookings page

import { mainClassName } from "@/components/page/pageCommons"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import DashboardHeader from "../../../components/extra/dashboardHeader"
import DriverAssignedBookingsPageComponent from "./driverAssignedBookings"

export default async function DriverDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const bookings = await driverServices.findDriverAssignedBookingsById(id)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/assigned"} />
      <DriverAssignedBookingsPageComponent bookings={bookings} id={id} />
    </div>
  )
}
