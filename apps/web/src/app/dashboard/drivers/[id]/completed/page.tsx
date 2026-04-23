import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import DashboardHeader from "../../../components/common/dashboardHeader"
import DriverCompletedBookingsPageComponent from "./driverCompletedBookings"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Driver Completed Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function DriverCompletedBookingsPage({
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
