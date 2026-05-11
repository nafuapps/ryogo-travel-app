//MyBooking/[id] page

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/components/header/riderHeader"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import {
  BookingStatusEnum,
  DriverStatusEnum,
} from "@ryogo-travel-app/db/schema"
import RiderMyCompletedBookingPageComponent from "./completedBooking"
import RiderMyOngoingBookingPageComponent from "./currentBooking"
import RiderMyUpcomingBookingPageComponent from "./upcomingBooking"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Booking Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  if (!bookingDetails || !bookingDetails.assignedDriverId) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  const driver = await driverServices.findDriverDetailsById(
    bookingDetails.assignedDriverId,
  )
  if (!driver) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  //Render based on booking status
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myBookings/[id]"} />
      {bookingDetails.status === BookingStatusEnum.CONFIRMED ? (
        <RiderMyUpcomingBookingPageComponent
          booking={bookingDetails}
          canStartTrip={
            bookingDetails.startDate <= new Date() &&
            bookingDetails.assignedVehicleId !== null &&
            driver.status === DriverStatusEnum.AVAILABLE
          }
        />
      ) : bookingDetails.status === BookingStatusEnum.IN_PROGRESS ? (
        <RiderMyOngoingBookingPageComponent booking={bookingDetails} />
      ) : (
        <RiderMyCompletedBookingPageComponent booking={bookingDetails} />
      )}
    </MainWrapper>
  )
}
