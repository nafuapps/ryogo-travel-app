import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { BookingIdRegex } from "@/lib/regex"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import TrackBookingDetailsPageComponent from "./trackBookingDetails"
import { redirect, RedirectType } from "next/navigation"

export const metadata: Metadata = {
  title: `Track Booking Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function TrackBookingDetailsPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  if (!BookingIdRegex.safeParse(bookingId).success) {
    redirect("/track/booking", RedirectType.replace)
  }

  const booking = await bookingServices.findBookingDetailsById(bookingId)
  if (!booking) {
    redirect("/track/booking", RedirectType.replace)
  }

  return <TrackBookingDetailsPageComponent booking={booking} />
}
