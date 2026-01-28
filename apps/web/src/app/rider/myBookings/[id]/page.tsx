//MyBooking/[id] page

import { mainClassName } from "@/components/page/pageCommons"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "../../components/riderHeader"
import { BookingRegex } from "@/lib/regex"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import RiderMyCompletedBookingPageComponent from "./completedBooking"
import RiderMyOngoingBookingPageComponent from "./currentBooking"
import RiderMyAssignedBookingPageComponent from "./upcomingBooking"

export default async function MyBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  //Invalid booking id regex check
  if (!BookingRegex.safeParse(id).success) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  const bookingDetails = await bookingServices.findBookingDetailsById(id)

  //Lead or cancelled bookings are not accessible
  if (
    !bookingDetails ||
    [BookingStatusEnum.CANCELLED, BookingStatusEnum.LEAD].includes(
      bookingDetails.status,
    )
  ) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  //Redirect based on booking status
  if (bookingDetails.status === BookingStatusEnum.CONFIRMED) {
    return (
      <div className={mainClassName}>
        <RiderHeader pathName={"/rider/myBookings/[id]"} />
        <RiderMyAssignedBookingPageComponent booking={bookingDetails} />
      </div>
    )
  }
  if (bookingDetails.status === BookingStatusEnum.IN_PROGRESS) {
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
