//MyBooking/[id] page

import { mainClassName } from "@/components/page/pageCommons"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "../../components/riderHeader"
import { BookingRegex } from "@/lib/regex"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import {
  BookingStatusEnum,
  TripLogTypesEnum,
} from "@ryogo-travel-app/db/schema"
import RiderMyCompletedBookingPageComponent from "./completedBooking"
import RiderMyOngoingBookingPageComponent from "./currentBooking"
import RiderMyAssignedBookingPageComponent from "./upcomingBooking"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"

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

  //Lead or cancelled or unassigned bookings are not accessible
  if (
    !bookingDetails ||
    bookingDetails.assignedDriverId == null ||
    bookingDetails.assignedVehicleId == null ||
    [BookingStatusEnum.CANCELLED, BookingStatusEnum.LEAD].includes(
      bookingDetails.status,
    )
  ) {
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
        <RiderMyAssignedBookingPageComponent
          booking={bookingDetails}
          driver={driver}
        />
      </div>
    )
  }
  if (bookingDetails.status == BookingStatusEnum.IN_PROGRESS) {
    return (
      <div className={mainClassName}>
        <RiderHeader pathName={"/rider/myBookings/[id]"} />
        <RiderMyOngoingBookingPageComponent
          booking={bookingDetails}
          driver={driver}
        />
      </div>
    )
  }
  return (
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider/myBookings/[id]"} />
      <RiderMyCompletedBookingPageComponent
        booking={bookingDetails}
        driver={driver}
      />
    </div>
  )
}
