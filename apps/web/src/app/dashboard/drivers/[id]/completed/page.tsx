//Drivers/id/completed bookings page

import { mainClassName } from "@/components/page/pageCommons"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import DashboardHeader from "../../../components/extra/dashboardHeader"
import DriverCompletedBookingsPageComponent from "./driverCompletedBookings"

export default async function DriverDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const bookings = await driverServices.findDriverCompletedBookingsById(id)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/completed"} />
      <DriverCompletedBookingsPageComponent bookings={bookings} id={id} />
    </div>
  )
}
