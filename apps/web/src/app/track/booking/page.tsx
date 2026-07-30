import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import TrackBookingPageComponent from "./trackBooking"

export const metadata: Metadata = {
  title: `Track Booking - ${pageTitle}`,
  description: pageDescription,
}

export default async function TrackBookingPage() {
  return <TrackBookingPageComponent />
}
