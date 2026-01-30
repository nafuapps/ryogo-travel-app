//MyBooking/[id] page

import { mainClassName } from "@/components/page/pageCommons"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "../../components/riderHeader"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import {
  BookingStatusEnum,
  DriverStatusEnum,
} from "@ryogo-travel-app/db/schema"
import RiderMyCompletedBookingPageComponent from "./completedBooking"
import RiderMyOngoingBookingPageComponent from "./currentBooking"
import RiderMyUpcomingBookingPageComponent from "./upcomingBooking"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"

export default async function MyBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  if (!bookingDetails || bookingDetails.assignedDriverId == null) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  const driver = await driverServices.findDriverDetailsById(
    bookingDetails.assignedDriverId,
  )
  if (!driver) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  //Redirect based on booking status
  if (bookingDetails.status == BookingStatusEnum.CONFIRMED) {
    return (
      <div className={mainClassName}>
        <RiderHeader pathName={"/rider/myBookings/[id]"} />
        <RiderMyUpcomingBookingPageComponent
          booking={bookingDetails}
          canStartTrip={
            bookingDetails.startDate <= new Date() &&
            driver.status == DriverStatusEnum.AVAILABLE
          }
        />
      </div>
    )
  }
  if (bookingDetails.status == BookingStatusEnum.IN_PROGRESS) {
    return (
      <div className={mainClassName}>
        <RiderHeader pathName={"/rider/myBookings/[id]"} />
        <RiderMyOngoingBookingPageComponent booking={bookingDetails} />
      </div>
    )
  }
  return (
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider/myBookings/[id]"} />
      <RiderMyCompletedBookingPageComponent booking={bookingDetails} />
    </div>
  )
}
